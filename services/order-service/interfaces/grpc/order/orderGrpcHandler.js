const OrderService = require('../../../application/services/order.service'); // Đảm bảo đường dẫn đúng với logic thực tế

// Handler cho RPC FromCart
async function fromCartHandler(call, callback) {
    try {
        const { userId, items } = call.request;
        // Gọi logic tạo order từ giỏ hàng
        const order = await OrderService.fromCart(userId, items);
        callback(null, {
            success: true,
            message: 'Order created from cart successfully',
            orderId: order.id || ''
        });
    } catch (error) {
        callback(null, {
            success: false,
            message: error.message || 'Failed to create order from cart',
            orderId: ''
        });
    }
}

// Handler cho RPC BuyNow
async function buyNowHandler(call, callback) {
    try {
        const { userId, item } = call.request;
        // Gọi logic đặt hàng mua ngay
        const order = await OrderService.buyNow(userId, item);
        callback(null, {
            success: true,
            message: 'Order created with buy now successfully',
            orderId: order.id || ''
        });
    } catch (error) {
        callback(null, {
            success: false,
            message: error.message || 'Failed to create order with buy now',
            orderId: ''
        });
    }
}

// Handler cho RPC Confirm
async function confirmHandler(call, callback) {
    try {
        const { orderId, userId } = call.request;
        // Gọi logic xác nhận đơn hàng
        await OrderService.confirmPayment(orderId, userId);
        callback(null, {
            success: true,
            message: 'Order confirmed successfully'
        });
    } catch (error) {
        callback(null, {
            success: false,
            message: error.message || 'Failed to confirm order'
        });
    }
}

module.exports = {
    fromCartHandler,
    buyNowHandler,
    confirmHandler
};