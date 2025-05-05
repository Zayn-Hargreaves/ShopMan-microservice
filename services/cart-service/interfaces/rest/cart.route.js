const router = require("express").Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const CartController = require("../../application/controllers/cart.controller")
router.get("/", asyncHandler(CartController.getCart))
router.post("/add", asyncHandler(CartController.addProductToCart))
router.put('/update', asyncHandler(CartController.updateProductToCart))


module.exports =router