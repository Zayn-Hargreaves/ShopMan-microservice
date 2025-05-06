const { OkResponse } = require("../../shared/cores/success.response.js")
const OrderService = require("../services/order.service.js")

class OrderController{
    buyNow = async(req, res,next)=>{
        const {ProductId, skuNo, quantity} = req.body
        const userId = req.headers['x-user-id'];
        new OkResponse({
            message:"create buy-now order success",
            metadata: await OrderService.buyNow({userId,productId:ProductId,skuNo,quantity})
        }).send(res)
    }
    fromCart = async(req, res, next)=>{
        const {selectedItems} = req.body
        const userId = req.headers['x-user-id'];
        new OkResponse({
            message:"create cart order success",
            metadata: await OrderService.fromCart((userId,selectedItems))
        }).send(res)
    }
    confirmPayment = async(req, res, next)=>{
        const {paymentIntentId} = req.body
        const userId = req.headers['x-user-id'];
        new OkResponse({
            message:'confirm payment success',
            metadata: await OrderService.confirmPayment({userId,paymentIntentId})
        }).send(res)
    }
}

module.exports = new OrderController()