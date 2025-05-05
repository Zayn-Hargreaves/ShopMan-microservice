const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "./product.proto";

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

async function getProductListFromProductService(items) {
    return new Promise((resolve, reject) => {
        client.GetProductsBySkuList({ items }, (err, response) => {
            if (err) return reject(err);
            resolve(response.products);
        });
    });
}

module.exports = getProductListFromProductService;
