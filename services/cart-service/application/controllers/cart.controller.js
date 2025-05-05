const { OkResponse } = require("../../shared/cores/success.response.js")
const CartService = require("../services/cart.service.js")
class CartController {
    getCart = async (req, res, next) => {
        const userId = req.userId
        new OkResponse({
            message: "get cart success",
            metadata: await CartService.getCart(userId)
        }).send(res)
    }

    addProductToCart = async (req, res, next) => {
        const { ProductId, skuNo, quantity } = req.query
        const userId = req.userId
        new OkResponse({
            message: "add product to cart success",
            metadata: await CartService.addProductToCart(userId, ProductId, skuNo, parseInt(quantity))
        }).send(res)
    }

    updateProductToCart = async (req, res, next) => {
        const { ProductId, skuNo, quantity } = req.query
        const userId = req.userId
        new OkResponse({
            message: 'update product to cart success',
            metadata: await CartService.updateProductToCart(userId, ProductId, skuNo, parseInt(quantity))
        }).send(res)
    }
}

module.exports = new CartController()
