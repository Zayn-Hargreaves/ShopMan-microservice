
class ProductRepository {
    constructor(models) {
        this.Product = models.Product
        this.Inventories = models.Inventories
        this.Sku = models.Sku
        this.SkuAttr = models.SkuAttr
        this.SkuSpecs = models.SkuSpecs
        this.SpuToSku = models.SpuToSku
    }
    async getSkuAttrsBySkuNos(skuNos) {
        return this.SkuAttr.findAll({ where: { sku_no: skuNos } });
    }
    async getProductById(productId) {
        return this.Product.findByPk(productId);
    }
    async findBySlug(slug){
        return this.Product.findOne({
            where:{
                slug:slug
            }
        })
    }
    async findAllSpuToSku(ProductId){
        return await this.SpuToSku.findAll({
            where:{
                ProductId
            }
        })
    }
    async findAllSku(skuNos){
        return await this.Sku.findAll({
            where:{
                sku_no:skuNos
            }
        })
    }
    async findAllSkuAttr(skuNos){
        return await this.SkuAttr.findAll({
            where:{
                sku_no:skuNos
            }
        })
    }
    async findAllSkuSpecs(SkuId){
        return await this.SkuSpecs.findAll({
            SkuId
        })
    }
    
}

module.exports = ProductRepository