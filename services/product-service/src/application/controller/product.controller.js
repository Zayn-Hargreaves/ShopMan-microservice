const { OkResponse } = require("../../shared//cores//success.response")
const ProductService = require("../service/product.service")
class ProductController{
    getAllProduct = async(req, res, next)=>{
        const {page, limit} = req.params
        new OkResponse({
            message:"get all product success",
            metadata: await ProductService.getListProduct(page, limit)
        }).send(res)
    }
    getProductDetail = async(req, res, next)=>{
        const slug = req.params.slug
        new OkResponse({
            message:"get product detail success",
            metadata : await ProductService.getProductDetail(slug)
        }).send(res)
    }
}

module.exports = new ProductController()