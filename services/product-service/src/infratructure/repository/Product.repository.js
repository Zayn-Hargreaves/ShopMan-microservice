const { getSelectData } = require("../../shared/utils/index")
class ProductRepository {
    constructor(models) {
        this.Product = models.Product;
        this.Inventories = models.Inventories;
        this.Sku = models.Sku;
        this.SkuAttr = models.SkuAttr;
        this.SkuSpecs = models.SkuSpecs;
        this.SpuToSku = models.SpuToSku;
    }

    async getProductById(productId) {
        return this.Product.findByPk(productId);
    }

    async findBySlug(slug) {
        return this.Product.findOne({
            where: { slug }
        });
    }

    async findAllSpuToSku(ProductId) {
        return this.SpuToSku.findAll({
            where: { ProductId }
        });
    }

    async findAllSku(skuNos) {
        console.log(this.Sku)
        return this.Sku.findAll({
            where: { sku_no: skuNos }
        });
    }

    async findAllSkuAttr(skuNos) {
        return this.SkuAttr.findAll({
            where: { sku_no: skuNos }
        });
    }

    async findAllSkuSpecs(SkuId) {
        return this.SkuSpecs.findAll({
            where: { SkuId }
        });
    }


    async increaseProductSaleCount(ProductId, quantity) {
        return this.Product.increment("sale_count", {
            by: quantity,
            where: { id: ProductId }
        });
    }

    async decrementInventory({ ProductId, ShopId, quantity }) {
        const inventory = await this.Inventories.findOne({
            where: {
                ProductId,
                ShopId
            }
        });

        if (!inventory) throw new Error(`Inventory not found for ProductId ${ProductId}`);

        if (inventory.inven_quantity < quantity) {
            throw new Error(`Insufficient stock for ProductId ${ProductId}`);
        }

        inventory.inven_quantity -= quantity;
        await inventory.save();

        return inventory;
    }

    async decrementSkuStock(skuNo, quantity) {
        const skuAttr = await this.SkuAttr.findOne({ where: { sku_no: skuNo } });

        if (!skuAttr) throw new Error(`SKU ${skuNo} not found`);
        if (skuAttr.sku_stock < quantity) {
            throw new Error(`Insufficient stock for SKU ${skuNo}`);
        }

        skuAttr.sku_stock -= quantity;
        await skuAttr.save();

        return skuAttr;
    }
    async getPaginatedProducts(page = 1, limit=10) {
        const offset = (page - 1) * limit
        const { count, rows } = await this.Product.findAndCountAll({
            where: {
                status: 'active'
            },
            attributes: getSelectData(['id', 'slug', 'name', 'sale_count', 'price', 'discount_percentage', 'thumb', 'rating']),
            limit,
            offset,
            order: [['sort', 'ASC']],
        })
        return {
            products: rows,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit)
        };
    }
}

module.exports = ProductRepository;
