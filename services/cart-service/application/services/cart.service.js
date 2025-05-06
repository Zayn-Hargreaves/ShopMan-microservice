const { NotFoundError } = require("../../shared/cores/error.response.js")
const RepositoryFactory = require("../../infratructure/repository/RepositoryFactory")
const getProductListFromProductService = require("../../interfaces/grpc/product/product.grpcClient.js");
class CartService {

    static async getCart(UserId) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        const rawCartItems = await CartRepo.findAllProductInCart(UserId);
        if (!rawCartItems.length) return [];

        const skuRequestItems = rawCartItems.map(item => ({
            productId: item.ProductId,
            skuNo: item.sku_no,
        }));

        const productDetails = await getProductListFromProductService(skuRequestItems);

        const productMap = {};
        for (const p of productDetails) {
            productMap[`${p.productId}_${p.skuNo}`] = p;
        }

        const enrichedCart = rawCartItems.map(item => {
            const key = `${item.ProductId}_${item.sku_no}`;
            const productInfo = productMap[key] || {};

            return {
                productId: item.ProductId,
                skuNo: item.sku_no,
                quantity: item.quantity,
                productName: productInfo.productName || "",
                price: productInfo.sku_price || 0,
                image: productInfo.thumb,
            };
        });

        return enrichedCart;
    }
    static validateAddProductInput(data) {
        const schema = Joi.object({
            UserId: Joi.string().required(),
            productId: Joi.string().required(),
            skuNo: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
        });

        const { error } = schema.validate(data);
        if (error) throw new BadRequestError(`Invalid input: ${error.message}`);
    }

    static async addProductToCart(UserId, productId, skuNo, quantity) {
        this.validateAddProductInput({ UserId, productId, skuNo, quantity })

        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        const item = await CartRepo.addProductToCart({
            UserId,
            ProductId: productId,
            sku_no: skuNo,
            quantity,
        });
        return item
    }
    static validateUpdateProductInput(data) {
        const schema = Joi.object({
            UserId: Joi.string().required(),
            productId: Joi.string().required(),
            skuNo: Joi.string().required(),
            quantity: Joi.number().integer().min(0).required(),
        });

        const { error } = schema.validate(data);
        if (error) throw new BadRequestError(`Invalid input: ${error.message}`);
    }

    static async updateProductToCart(UserId, productId, skuNo, quantity) {
        await RepositoryFactory.initialize();
        this.validateUpdateProductInput({ UserId, productId, skuNo, quantity });

        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        const cart = await CartRepo.findByUserId(UserId);
        if (!cart) throw new NotFoundError("Cart not found for the specified user");

        const item = await CartRepo.updateProductToCart({ UserId, ProductId: productId, sku_no: skuNo, quantity });
        if (!item) throw new NotFoundError(`Product ${productId} with SKU ${skuNo} not found in the cart`);

        return { message: "Updated successfully", item };
    }

    static async createCartIfNotExist(UserId) {
        await RepositoryFactory.initialize()

        const CartRepo = RepositoryFactory.getRepository("CartRepository")
        return await CartRepo.getOrCreateCart(UserId)

    }

    static async RemoveOrderdItem({ userId, orderid, orderItems = [] }) {
        await RepositoryFactory.initialize()
        const CartRepository = RepositoryFactory.getRepository("CartRepository")
        const cart = CartRepository.findByUserId(userId)
        if (!cart) {
            throw new NotFoundError(`No active cart found for user ${userId} or cart not found`)
        }
        const CartId = cart.id
        for (const item of orderItems) {
            const { productId, skuNo } = item

            const deleteCount = await CartRepository.RemoveOrderdItem(CartId, productId, skuNo)
        }
    }
}

module.exports = CartService