const ProductService = require('../../application/service/product.service');

async function GetAllProducts(call, callback) {
  try {
    const products = await ProductService.getListProduct();
    callback(null, { products });
  } catch (e) {
    callback(e, null);
  }
}


async function GetProductBySlug(call, callback) {
  try {
    const { slug } = call.request;
    const product = await ProductService.getProductDetail(slug);

    const productDetail = {
      id: product.id,
      name: product.name,
      desc: product.desc,
      desc_plain: product.desc_plain,
      price: parseFloat(product.price),
      discount_percentage: product.discount_percentage,
      thumb: product.thumb,
      attrs: product.attrs || {}, // Truyền object JS gốc, protobufjs sẽ tự chuyển sang Struct
      status: product.status,
      slug: product.slug,
      CategoryId: product.CategoryId,
      CategoryPath: Array.isArray(product.CategoryPath) ? product.CategoryPath : [],
      sort: product.sort,
      ShopId: product.ShopId,
      rating: parseFloat(product.rating),
      sale_count: product.sale_count,
      has_variations: !!product.has_variations,
      createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : `${product.createdAt}`,
      updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : `${product.updatedAt}`,
      skus: Array.isArray(product.skus) ? product.skus.map(sku => ({
        id: sku.id,
        ProductId: sku.ProductId,
        sku_no: sku.sku_no,
        sku_name: sku.sku_name,
        sku_desc: sku.sku_desc,
        sku_type: sku.sku_type,
        status: sku.status,
        sort: sku.sort,
        sku_stock: sku.sku_stock,
        sku_price: parseFloat(sku.sku_price),
        skuAttr: Array.isArray(sku.skuAttr)
          ? sku.skuAttr.map(attr => ({
            id: attr.id,
            sku_no: attr.sku_no,
            sku_stock: attr.sku_stock,
            sku_price: parseFloat(attr.sku_price),
            sku_attrs: attr.sku_attrs || {}, // Truyền object gốc
            createdAt: attr.createdAt instanceof Date ? attr.createdAt.toISOString() : `${attr.createdAt}`,
            updatedAt: attr.updatedAt instanceof Date ? attr.updatedAt.toISOString() : `${attr.updatedAt}`,
          }))
          : [],
        skuSpecs: Array.isArray(sku.skuSpecs)
          ? sku.skuSpecs.map(spec => ({
            id: spec.id,
            SkuId: spec.SkuId,
            sku_specs: spec.sku_specs || {}, // Truyền object gốc
            createdAt: spec.createdAt instanceof Date ? spec.createdAt.toISOString() : `${spec.createdAt}`,
            updatedAt: spec.updatedAt instanceof Date ? spec.updatedAt.toISOString() : `${spec.updatedAt}`,
          }))
          : [],
      })) : [],
    };

    callback(null, productDetail);
  } catch (e) {
    console.error('GetProductBySlug error:', e);
    callback(e, null);
  }
}
// {
//   productId: 0,
//   skuNo: '',
//   productName: '',
//   sku_price: 0,
//   sku_stock: 0,
//   thumb: ''
// },
async function GetProductsBySkuList(call, callback) {
  try {
    const { items } = call.request;
    let products = await ProductService.getProductsBySkuList(items);
    products = products.map(p => ({
      productId: Number(p.productId), // đảm bảo int32
      skuNo: String(p.skuNo),
      productName: String(p.productName || ""),
      sku_price: p.sku_price !== undefined ? parseFloat(p.sku_price) : 0, // float
      sku_stock: p.sku_stock !== undefined ? Number(p.sku_stock) : 0,     // int32
      thumb: p.thumb ? String(p.thumb) : ""
    }));
    console.log(products)
    callback(null, { products });
  } catch (e) {
    callback(e, null);
  }
}
async function GetPaginatedProducts(call, callback) {
  try {
    const { items } = call.request;
    const data = await ProductService.getListProduct(items);

    // Định dạng lại dữ liệu sản phẩm
    const products = data.products.map((product) => ({
      productId: product.dataValues.id,
      slug: product.dataValues.slug,
      productName: product.dataValues.name,
      sale_count: product.dataValues.sale_count,
      price: parseFloat(product.dataValues.price), // Chuyển đổi sang float
      discount_percentage: parseFloat(product.dataValues.discount_percentage), // Chuyển đổi sang float
      thumb: product.dataValues.thumb,
      rating: product.dataValues.rating,
    }));
    callback(null, {
      products,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages,
    });
  } catch (e) {
    callback(e, null);
  }
}

module.exports = { GetAllProducts, GetProductBySlug, GetProductsBySkuList, GetPaginatedProducts };