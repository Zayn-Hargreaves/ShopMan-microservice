const OrderService = require('../../../application/services/order.service'); // Đảm bảo đường dẫn đúng với logic thực tế

// Handler cho RPC FromCart
async function fromCart(call, callback) {
    try {
        const { userId, items } = call.request;
        const order = await OrderService.fromCart({ userId, selectedItems: items });
        console.log(order)
        callback(null, {
            success: true,
            message: 'Order created from cart successfully',
            paymentIntentClientSecret: order.paymentIntentClientSecret,
            items: order.items,
            totalAmount: order.totalAmount
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
async function buyNow(call, callback) {
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
async function confirm(call, callback) {
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
    fromCart,
    buyNow,
    confirm
};