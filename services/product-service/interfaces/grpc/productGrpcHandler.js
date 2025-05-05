const ProductService = require("../../application/service/product.service");

async function GetProductsBySkuList(call, callback) {
  try {
    const { items } = call.request;
    const products = await ProductService.GetProductsBySkuList(items);
    callback(null, { products });
  } catch (err) {
    console.error(err);
    callback(err);
  }
}

module.exports = {
  GetProductsBySkuList,
};
