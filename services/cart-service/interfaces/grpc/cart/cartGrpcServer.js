const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { getCartHandler, addToCartHandler, updateCartItemHandler } = require('./cart.GrpcHandler');

const PROTO_PATH = path.join(__dirname, './cart.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const cartProto = grpc.loadPackageDefinition(packageDefinition).cart;

function startGrpcServer() {
    const server = new grpc.Server();

    server.addService(cartProto.CartService.service, {
        GetCart: getCartHandler,
        AddToCart: addToCartHandler,
        UpdateCartItem: updateCartItemHandler
    });

    server.bindAsync('0.0.0.0:50054', grpc.ServerCredentials.createInsecure(), () => {
        console.log('🚀 gRPC CartService running at 50054');
        server.start();
    });
}

module.exports = { startGrpcServer };