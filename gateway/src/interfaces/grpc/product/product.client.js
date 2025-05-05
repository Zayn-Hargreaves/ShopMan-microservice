const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, './product.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const productProto = grpc.loadPackageDefinition(packageDefinition).product;

const client = new productProto.ProductService(
    'localhost:50052', // Cổng gRPC của Product Service
    grpc.credentials.createInsecure()
);

module.exports = client;