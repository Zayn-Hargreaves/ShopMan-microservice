// interfaces/grpc/product.client.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Đường dẫn đến file product.proto
const PROTO_PATH = path.resolve(__dirname, './product.proto');

// Load proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const productProto = grpc.loadPackageDefinition(packageDefinition).product;

// Khởi tạo client gRPC
const client = new productProto.ProductService(
    process.env.PRODUCT_GRPC_URL || 'localhost:50051',
    grpc.credentials.createInsecure()
);

module.exports = client;
