const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/order.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
const orderProto = grpc.loadPackageDefinition(packageDefinition).order;

const client = new orderProto.OrderService(
    'localhost:50053',
    grpc.credentials.createInsecure()
);

module.exports = client;