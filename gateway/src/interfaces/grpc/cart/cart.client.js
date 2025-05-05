const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, './cart.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const cartProto = grpc.loadPackageDefinition(packageDefinition).cart;

const client = new cartProto.CartService(
    'localhost:50054', // Cổng của Cart Service gRPC server
    grpc.credentials.createInsecure()
);

module.exports = client;