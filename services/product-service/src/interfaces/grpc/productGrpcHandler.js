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
    callback(null, product);
  } catch (e) {
    callback(e, null);
  }
}

async function GetProductsBySkuList(call, callback) {
  try {
    const { items } = call.request;
    const products = await ProductService.getProductsBySkuList(items);
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