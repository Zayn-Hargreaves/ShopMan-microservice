const { NotFoundError } = require("../../../../user-service/src/shared/cores/error.response");
const RepositoryFactory = require("../../infratructure/repository/repositoryFactory")
class ProductService {
    static async getProductDetail(slug) {
        await RepositoryFactory.initialize();
        const ProductRepository = RepositoryFactory.getRepository("ProductRepository");
        const product = await ProductRepository.findBySlug(slug);

        if (!product) throw new Error("Not found");

        const spuToSkus = await ProductRepository.findAllSpuToSku(product.id);
        const skuNos = spuToSkus.map(s => s.sku_no);

        const skus = await ProductRepository.findAllSku(skuNos);
        const skuAttrs = await ProductRepository.findAllSkuAttr(skuNos);
        const skuSpecs = await ProductRepository.findAllSkuSpecs(skus.map(s => s.id));

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
    static async getListProduct(page, limit) {
        await RepositoryFactory.initialize()
        const ProductRepository = RepositoryFactory.getRepository("ProductRepository")
        return await ProductRepository.getPaginatedProducts(page, limit)

    }


    static async getProductsBySkuList(items) {
        await RepositoryFactory.initialize();
        const ProductRepository = RepositoryFactory.getRepository("ProductRepository");

        const skuNos = items.map(i => i.skuNo);

        const [skuAttrs, productsById] = await Promise.all([
            ProductRepository.findAllSkuAttr(skuNos),
            ProductRepository.getProductsByIds(items.map(i => i.productId))
        ]);
        // Chuyển từ Sequelize instance về plain object
        const plainProducts = productsById.map(p => p.dataValues ? p.dataValues : p);
        const skuMap = Object.fromEntries(skuAttrs.map(s => [s.sku_no, s]));
        const productMap = Object.fromEntries(plainProducts.map(p => [p.id, p]));

        const result = items.map(({ productId, skuNo }) => {
            const skuAttr = skuMap[skuNo];
            const product = productMap[productId];
            if (!skuAttr || !product) return null;
            console.log()
            return {
                productId,
                skuNo,
                sku_price: skuAttr.sku_price,
                sku_stock: skuAttr.sku_stock,
                productName: product.name, // lúc này chắc chắn là lấy được name
            };
        }).filter(Boolean);

        return result;
    }

    static async handleOrderCreated({ userId, orderId, orderItems = [] }) {
        await RepositoryFactory.initialize();
        const productRepo = RepositoryFactory.getRepository("ProductRepository");

        const orderProcessingPromises = orderItems.map(async (item) => {
            const { productId, skuNo, quantity } = item;
            try {
                const product = await productRepo.getProductById(productId);
                if (!product) throw new NotFoundError(`Product ${productId} not found`);

                await Promise.all([
                    productRepo.decrementInventory({
                        ProductId: productId,
                        ShopId: product.ShopId,
                        quantity
                    }),
                    productRepo.decrementSkuStock(skuNo, quantity),
                    productRepo.increaseProductSaleCount(productId, quantity)
                ]);

                console.log(`✅ Processed order item: productId=${productId}, skuNo=${skuNo}, quantity=${quantity}`);
            } catch (err) {
                console.error(`❌ Failed to process order item [${productId} - ${skuNo}]:`, err.message);
            }
        });

        await Promise.all(orderProcessingPromises);

        console.log(`✅ [product-service] Inventory and sale updated for order ${orderId}`);
    }
}



module.exports = ProductService