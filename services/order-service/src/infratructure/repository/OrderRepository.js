class OrderRepository {
    constructor(models) {
        this.Order = models.Order;
        this.OrderDetails = models.OrderDetails;
    }

    async createOrder({ UserId, TotalPrice, Status }) {
        return await this.Order.create({ UserId, TotalPrice, Status });
    }

    async bulkCreateOrderDetails(orderId, details = []) {
        const formatted = details.map(d => ({
            OrderId: orderId,
            ProductId: d.ProductId,
            quantity: d.quantity,
            price_at_time: d.price_at_time
        }));
        return await this.OrderDetails.bulkCreate(formatted);
    }


    async getOrderById(orderId) {
        return await this.Order.findByPk(orderId, {
            include: [this.OrderDetails]
        });
    }
}

module.exports = OrderRepository;
