const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { fromCartHandler, buyNowHandler, confirmHandler } = require('./orderGrpcHandler');

const PROTO_PATH = __dirname + '/order.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
const orderProto = grpc.loadPackageDefinition(packageDefinition).order;

function startGrpcServer() {
    const server = new grpc.Server();
    server.addService(orderProto.OrderService.service, {
        FromCart: fromCartHandler,
        BuyNow: buyNowHandler,
        Confirm: confirmHandler,
    });

    server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
        console.log('🚀 gRPC OrderService running on 50053');
        server.start();
    });
}

module.exports = { startGrpcServer };