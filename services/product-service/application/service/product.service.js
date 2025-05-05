const { NotFoundError } = require("../../../user-service/shared/cores/error.response");
const productRepository = require("../../infratructure/edb/productRepository");
const RepositoryFactory = require("../../infratructure/repository/repositoryFactory")
class ProductService {
    static async getProductDetail(slug) {
        await RepositoryFactory.initialize()
        const ProductRepository = RepositoryFactory.getRepository("ProductRepository")
        const product = await ProductRepository.findBySlug(slug)
        if (!product) throw new Error("Not found");

        const spuToSkus = await ProductRepository.findAllSpuToSku(product.id)

        const skuNos = spuToSkus.map(s => s.sku_no);
        const skus = await ProductRepository.findAllSku(skuNos);
        const skuAttrs = await ProductRepository.findAllSkuAttr(skuNos);
        const SkuId = skus.map(s => s.id)
        const skuSpecs = await ProductRepository.findAllSkuSpecs(SkuId);

        const skuAttrMap = Object.fromEntries(skuAttrs.map(a => [a.sku_no, a]));
        const skuSpecMap = skus.reduce((acc, sku) => {
            acc[sku.id] = skuSpecs.filter(spec => spec.SkuId === sku.id);
            return acc;
        }, {});

        const fullSkus = skus.map(sku => ({
            ...sku.toJSON(),
            skuAttr: skuAttrMap[sku.sku_no],
            skuSpecs: skuSpecMap[sku.id] || [],
        }));

        return {
            ...product.toJSON(),
            skus: fullSkus,
        };
    }

    static async getListProduct({ lastSortValues, pageSize, isAndroid }) {
        const result = await productRepository.searchProducts({
            lastSortValues,
            pageSize,
            isAndroid
        })
        return result
    }


    async getProductsBySkuList(items) {
        await RepositoryFactory.initialize()
        const ProductRepository = RepositoryFactory.getRepository("ProductRepository")
        const skuNos = items.map(i => i.skuNo);
        const skuAttrs = await ProductRepository.findAllSkuAttr(skuNos);
        const skuMap = Object.fromEntries(skuAttrs.map(s => [s.sku_no, s]));

        const result = [];

        for (const { productId, skuNo } of items) {
            const skuAttr = skuMap[skuNo];
            if (!skuAttr) continue;

            const product = await ProductRepository.getProductById(productId);
            if (!product) continue;

            result.push({
                productId,
                skuNo,
                sku_price: skuAttr.sku_price,
                sku_stock: skuAttr.sku_stock,
                productName: product.name,
            });
        }

        return result;
    }

    static async updateProductSaleCount(id, count){
    await RepositoryFactory.initialize()
    const ProductRepository = await RepositoryFactory.getRepository("ProductRepository")
    return await ProductRepository.updateProductSaleCount(id, count)
}
    
}

module.exports = ProductService