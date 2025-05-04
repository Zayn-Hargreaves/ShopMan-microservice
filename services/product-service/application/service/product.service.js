const { NotFoundError } = require("../../../user-service/shared/cores/error.response");
const productRepository = require("../../infratructure/edb/productRepository");
const RepositoryFactory = require("../../infratructure/repository/repositoryFactory")
class ProductService{
    static async getProductDetail(slug){
        await RepositoryFactory.initialize()
        const ProductRepository = await RepositoryFactory.getRepository("ProductRepository")
        if(!slug){
            throw new NotFoundError("Product not found")
        }
        const productData= await ProductRepository.getProductDetailBySlug(slug)
        if(!productData){
            throw NotFoundError("Product not found")
        }
        return productData
    }
    static async getListProduct({lastSortValues,pageSize,isAndroid}){
        const result = await productRepository.searchProducts({
            lastSortValues,
            pageSize,
            isAndroid
        })
        return result
    }
    static async updateProductSaleCount(id, count){
        await RepositoryFactory.initialize()
        const ProductRepository = await RepositoryFactory.getRepository("ProductRepository")
        return await ProductRepository.updateProductSaleCount(id, count)
    }
    
}

module.exports = ProductService