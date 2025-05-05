class CartRepository {
    constructor(models) {
        this.Cart = models.Cart;
        this.CartsDetails = models.CartsDetails;
    }
    async getOrCreateCart(UserId) {
        let cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) {
            cart = await this.Cart.create({ UserId, cart_total: 0, cart_status: "active" });
        }
        return cart;
    }
    async findByUserId(UserId) {
        return await this.Cart.findOne({
            where: {
                UserId,
                cart_status: "active"
            }
        })
    }
    async RemoveOrderdItem(CartId, ProductId, skuNo) {
        return this.CartsDetails.destroy({
            where: {
                CartId,
                ProductId,
                sku_no: skuNo
            }
        })
    }
    async updateProductToCart({ UserId, ProductId, sku_no, quantity }) {
        const cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) throw new Error("Cart not found");
    
        const item = await this.CartsDetails.findOne({ where: { CartId: cart.id, ProductId, sku_no } });
        if (!item) throw new Error("Product not found in cart");
    
        if (quantity === 0) {
            await item.destroy();
            return null;
        }
    
        item.quantity = quantity;
        await item.save();
    
        return item;
    }
    
    async findAllProductInCart(UserId) {
        const cart = await this.Cart.findOne({ where: { UserId, cart_status: "active" } });
        if (!cart) return [];

        return await this.CartsDetails.findAll({
            where: { CartId: cart.id },
            raw: true
        });
    }
    async addProductToCart({ UserId, ProductId, sku_no, quantity }) {
        const cart = await this.getOrCreateCart(UserId);
        let item = await this.CartsDetails.findOne({ where: { CartId: cart.id, ProductId, sku_no } });

        if (item) {
            item.quantity += quantity;
            await item.save();
        } else {
            item = await this.CartsDetails.create({ CartId: cart.id, ProductId, sku_no, quantity });
        }

        return item; 
    }

}

module.exports = CartRepository;
