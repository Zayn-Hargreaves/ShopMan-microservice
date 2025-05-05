const ProductService = require("../../application/service/product.service");

async function GetProductsBySkuList(call, callback) {
  try {
    const { items } = call.request;
    const products = await ProductService.GetProductsBySkuList(items);
    callback(null, { products });
  } catch (err) {
    console.error(err);
    callback({
      code: grpc.status.NOT_FOUND,
      message: `Error fetching products::::${err.message}`
    });
  }
}
async function GetAllProducts(call, callback) {
  try {
    const products = await ProductService.getAllProducts(); // Gọi logic từ service
    callback(null, { products });
  } catch (err) {
    console.error(err);
    callback({
      code: grpc.status.INTERNAL,
      message: `Error fetching products: ${err.message}`,
    });
  }
}

module.exports = {
  GetProductsBySkuList,
  GetAllProducts
};
