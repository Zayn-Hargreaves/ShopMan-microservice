const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const {
    GetAllProducts,
    GetProductBySlug,
    GetProductsBySkuList
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
    GetProductsBySkuList
});

server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('🚀 gRPC ProductService running on port 50052');
});