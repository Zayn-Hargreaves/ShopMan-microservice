const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load proto file
const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "./product.proto"), // đảm bảo đường dẫn đúng
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
);

const productProto = grpc.loadPackageDefinition(packageDefinition).product;

// Tạo client gRPC kết nối sang ProductService
const client = new productProto.ProductService(
    "localhost:50052",
    grpc.credentials.createInsecure()
);

// Hàm gọi thực tế
async function getProductListFromProductService(items) {
    return new Promise((resolve, reject) => {
        client.GetProductsBySkuList({ items }, (err, response) => {
            if (err) return reject(err);
            resolve(response.products);
        });
    });
}

module.exports = { getProductListFromProductService };
