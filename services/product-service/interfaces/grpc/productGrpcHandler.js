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

module.exports = { GetAllProducts, GetProductBySlug, GetProductsBySkuList };