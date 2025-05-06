const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const {
    GetAllProducts,
    GetProductBySlug,
    GetProductsBySkuList,
    GetPaginatedProducts
} = require('./productGrpcHandler');

const PROTO_PATH = path.resolve(__dirname, './product.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

const server = new grpc.Server();

server.addService(productProto.ProductService.service, {
    GetAllProducts,
    GetProductBySlug,
    GetProductsBySkuList,
    GetPaginatedProducts
});

// Bind server to a valid address
server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind server:', err.message);
        return;
    }
    console.log(`🚀 gRPC ProductService running on port ${port}`);
    server.start(); // Start the server only after successful binding
});