const RepositoryFactory = require("../../infratructure/repository/RepositoryFactory");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { getProductListFromProductService } = require("../../interfaces/grpc/product/productClient")
const { runProducer } = require("../../infratructure/rabbit mq/rabbitmq")
const Joi = require("joi");
const { NotFoundError, BadRequestError, ConflictError } = require("../../shared/cores/error.response");
class OrderService {
    static validateFromCartInput(data) {
        const schema = Joi.object({
            userId: Joi.string().required(),
            selectedItems: Joi.array()
                .items(
                    Joi.object({
                        productId: Joi.string().required(),
                        skuNo: Joi.string().required(),
                        quantity: Joi.number().integer().min(1).required(),
                    })
                )
                .min(1)
                .required(),
        });

        const { error } = schema.validate(data);
        if (error) throw new Error(`Input validation error: ${error.message}`);
    }

    static async fromCart({ userId, selectedItems = [] }) {
        this.validateFromCartInput({ userId, selectedItems });

        const lockList = [];
        let totalAmount = 0;
        const finalItems = [];

        // Gọi gRPC ProductService để lấy thông tin sản phẩm
        const productInfoList = await getProductListFromProductService(
            selectedItems.map(({ productId, skuNo }) => ({ productId, skuNo }))
        );

        const productMap = Object.fromEntries(
            productInfoList.map(p => [`${p.productId}_${p.skuNo}`, p])
        );

        try {
            const productProcessing = selectedItems.map(async (item) => {
                const { productId, skuNo, quantity } = item;
                const key = `${productId}_${skuNo}`;
                const productDetail = productMap[key];

                if (!productDetail || productDetail.sku_stock < quantity) {
                    throw new NotFoundError(`Product ${productId} - ${skuNo} is out of stock or unavailable`);
                }

                const lock = await RedisService.acquireLock({
                    productID: productId,
                    skuNo,
                    cartID: userId,
                    quantity,
                    timeout: 900,
                });
                if (!lock) throw new NotFoundError(`Product ${productId} is being checked out by another user.`);
                lockList.push(lock);

                const unitPrice = parseFloat(productDetail.sku_price || 0);
                const itemTotal = quantity * unitPrice;
                totalAmount += itemTotal;

                finalItems.push({
                    ...item,
                    unitPrice,
                    itemTotal,
                    productName: productDetail.productName,
                });
            });

            await Promise.all(productProcessing);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalAmount * 100),
                currency: "sgd",
                metadata: {
                    userId: String(userId),
                    lockKeys: lockList.map(l => l.key).join(','),
                },
            });

            return {
                paymentIntentClientSecret: paymentIntent.client_secret,
                items: finalItems,
                totalAmount,
            };
        } finally {
            for (const lock of lockList) {
                await RedisService.releaseLock(lock);
            }
        }
    }
    static validateBuyNowInput(data) {
        const schema = Joi.object({
            userId: Joi.string().required(),
            productId: Joi.string().required(),
            skuNo: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
        });

        const { error } = schema.validate(data);
        if (error) throw new Error(`Input validation error: ${error.message}`);
    }

    static async buyNow({ userId, productId, skuNo, quantity }) {
        this.validateBuyNowInput({ userId, productId, skuNo, quantity });
        const lock = await RedisService.acquireLock({
            productID: productId,
            skuNo,
            cartID: userId,
            quantity,
            timeout: 900,
        });

        if (!lock) throw new NotFoundError(`Product ${productId} is being processed by another user.`);

        try {
            const [productDetail] = await getProductListFromProductService([{ productId, skuNo }]);

            if (!productDetail || productDetail.sku_stock < quantity) {
                throw new NotFoundError("Product not available or insufficient stock");
            }

            const unitPrice = parseFloat(productDetail.sku_price || 0);
            const itemTotal = quantity * unitPrice;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(itemTotal * 100),
                currency: "sgd",
                metadata: {
                    userId: String(userId),
                    lockKeys: lock.key,
                },
            });

            return {
                paymentIntentClientSecret: paymentIntent.client_secret,
                productId,
                skuNo,
                quantity,
                unitPrice,
                itemTotal,
                productName: productDetail.productName,
            };
        } finally {
            await RedisService.releaseLock(lock);
        }
    }

    static async confirmPayment({ userId, paymentIntentId }) {
        await RepositoryFactory.initialize();
        const OrderRepo = RepositoryFactory.getRepository("OrderRepository");

        // 1. Kiểm tra trạng thái thanh toán
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent || paymentIntent.status !== "succeeded") {
            throw new BadRequestError("Payment not completed or invalid");
        }

        // 2. Gỡ khóa Redis
        const lockKeys = paymentIntent.metadata.lockKeys?.split(',') || [];
        for (const key of lockKeys) {
            await RedisService.releaseLock({ key });
        }

        // 3. Lấy orderItems từ metadata (nên đã có cả skuNo từ bước fromCart)
        let orderItems;
        try {
            orderItems = JSON.parse(paymentIntent.metadata.orderItems || "[]");
        } catch (e) {
            throw new ConflictError("Invalid order item data", e);
        }

        if (!orderItems.length) throw new ConflictError("No items in order metadata");

        // 4. Tính tổng và chuẩn bị chi tiết đơn hàng
        let orderTotal = 0;
        const orderDetailsData = [];

        for (const item of orderItems) {
            const { productId, skuNo, quantity, unitPrice } = item;
            const itemTotal = parseFloat(unitPrice) * quantity;
            orderTotal += itemTotal;

            orderDetailsData.push({
                ProductId: productId,
                quantity,
                price_at_time: unitPrice,
            });
        }

        const order = await OrderRepo.createOrder({
            UserId: userId,
            TotalPrice: orderTotal,
            Status: "paid",
        });

        await OrderRepo.bulkCreateOrderDetails(order.id, orderDetailsData);

        const topic = 'order.created';
        const message = {
            userId,
            orderId: order.id,
            orderItems,
            orderTotal,
            paymentMethod: "Stripe",
            createdAt: new Date().toISOString(),
        };

        const EXCHANGE = 'userEvents';
        const DLX_EXCHANGE = 'userEventsDLX';
        const DLX_ROUTING_KEY = 'userEventsDLX.routingKey';

        await Promise.all([
            runProducer(topic, message, EXCHANGE, 'cartEventsQueue', DLX_EXCHANGE, DLX_ROUTING_KEY),
            runProducer(topic, message, EXCHANGE, 'notificationEventsQueue', DLX_EXCHANGE, DLX_ROUTING_KEY),
            runProducer(topic, message, EXCHANGE, 'productEventsQueue', DLX_EXCHANGE, DLX_ROUTING_KEY),
        ]);

        return {
            orderCreated: true,
            paymentIntentId,
            orderId: order.id,
            total: orderTotal,
        };
    }

}

module.exports = OrderService;