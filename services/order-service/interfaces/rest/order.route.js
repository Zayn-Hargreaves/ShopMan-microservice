const express = require("express")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const orderController = require("../../application/controllers/order.controller")

router.post("/buynow", asyncHandler(orderController.buyNow))
router.post("/from-cart", asyncHandler(orderController.fromCart))
router.post("/confirm", asyncHandler(orderController.confirmPayment))

module.exports = router