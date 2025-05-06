const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/product.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

const client = new productProto.ProductService(
    "localhost:50052",
    grpc.credentials.createInsecure()
);


// [
//     { productId: 32, skuNo: 'SKU-TSHIRT-032-BEIGE-L' },
//     { productId: 35, skuNo: 'SKU-SHIRT-035-RED-L' }
//   ]
async function getProductListFromProductService(items) {
    // Đảm bảo items là mảng đúng định dạng, nếu không sẽ log lỗi
    if (!Array.isArray(items) || items.length === 0) {
        console.error("getProductListFromProductService: items phải là mảng không rỗng!");
        return [];
    }
    // Log rõ ràng hơn dữ liệu gửi đi
    console.log("Calling gRPC with items:", JSON.stringify(items, null, 2));
    return new Promise((resolve, reject) => {
        // Đảm bảo truyền đúng keys, đúng camelCase theo proto
        const payload = {
            items: items.map(item => ({
                productId: item.productId,
                skuNo: item.skuNo,
            })),
        };
        client.GetProductsBySkuList(payload, (err, response) => {
            if (err) {
                console.error("gRPC GetProductsBySkuList error:", err);
                return reject(err);
            }
            if (!response || !Array.isArray(response.products)) {
                console.error("gRPC GetProductsBySkuList trả về dữ liệu không hợp lệ:", response);
                return resolve([]);
            }
            resolve(response.products);
        });
    });
}

module.exports = getProductListFromProductService;
