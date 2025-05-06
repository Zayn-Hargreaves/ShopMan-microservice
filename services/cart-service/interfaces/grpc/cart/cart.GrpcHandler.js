const CartService = require('../../../application/services/cart.service');

async function getCart(call, callback) {
    try {
        const { userId } = call.request;
        const items = await CartService.getCart(userId);
        callback(null, { items });
    } catch (error) {
        callback(null, { items: [], message: error.message });
    }
}

async function addToCart(call, callback) {
    try {
        const userId= call.request.userId;
        const {productId,skuNo, quantity} = call.request.item
        await CartService.addProductToCart(userId, productId,skuNo,quantity);
        callback(null, { success: true, message: 'Add to cart success' });
    } catch (error) {
        callback(null, { success: false, message: error.message });
    }
}

async function updateCartItem(call, callback) {
    try {
        const { userId, item } = call.request;
        await CartService.updateProductToCart(userId, item);
        callback(null, { success: true, message: 'Update cart item success' });
    } catch (error) {
        callback(null, { success: false, message: error.message });
    }
}

module.exports = {
    getCart,
    addToCart,
    updateCartItem
};