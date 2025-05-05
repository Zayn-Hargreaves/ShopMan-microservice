const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, './order.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const orderProto = grpc.loadPackageDefinition(packageDefinition).order;

const client = new orderProto.OrderService(
    'localhost:50053', // cổng của order-service gRPC server
    grpc.credentials.createInsecure()
);

module.exports = client;