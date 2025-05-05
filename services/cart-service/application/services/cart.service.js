const { NotFoundError } = require("../../../user-service/shared/cores/error.response")
const RepositoryFactory = require("../../infratructure/repository/RepositoryFactory")
const getProductListFromProductService = require("../../interfaces/grpc/product.grpcClient.js");
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

        const productDetails = await getProductListFromProductService(skuRequestItems); // gọi sang product-service
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


    static async addProductToCart(UserId, productId, skuNo, quantity) {
        if (!UserId || !productId || !skuNo || !quantity || quantity <= 0) {
            throw new Error("Invalid input for adding product to cart");
        }

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


    static async updateProductToCart(UserId, productId, skuNo, quantity) {
        await RepositoryFactory.initialize();
        const CartRepo = RepositoryFactory.getRepository("CartRepository");

        const result = await CartRepo.updateProductToCart({ UserId, ProductId: productId, sku_no: skuNo, quantity });

        return { message: "Updated successfully" };
    }

    static async createCartIfNotExist(UserId){
        await RepositoryFactory.initialize()
        const CartRepo = RepositoryFactory.getRepository()
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