const express = require("express")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const productController = require("../../application/controller/product.controller")

router.get("/", asyncHandler(productController.getAllProduct))
router.get("/detail/:slug", asyncHandler(productController.getProductDetail))
module.exports = router