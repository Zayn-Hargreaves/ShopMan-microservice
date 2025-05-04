const { OkResponse } = require("../../../user-service/shared/cores/success.response")
const ProductService = require("../service/product.service")
class ProductController{
    getAllProduct = async(req, res, next)=>{
        const {lastSortValues, pageSize, isAndroid} = req.query
        new OkResponse({
            message:"get all product success",
            metadata: await ProductService.getListProduct({lastSortValues,pageSize,isAndroid})
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