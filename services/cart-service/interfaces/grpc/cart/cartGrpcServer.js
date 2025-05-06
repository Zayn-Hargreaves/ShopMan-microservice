const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { getCart, addToCart, updateCartItem } = require('./cart.GrpcHandler');

const PROTO_PATH = path.join(__dirname, './cart.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const cartProto = grpc.loadPackageDefinition(packageDefinition).cart;

const server = new grpc.Server()
server.addService(cartProto.CartService.service,{
    getCart,
    addToCart,
    updateCartItem
})

server.bindAsync('0.0.0.0:50054', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind server:', err.message);
        return;
    }
    console.log(`🚀 gRPC ProductService running on port ${port}`);
    server.start(); // Start the server only after successful binding
});
// function startGrpcServer() {
//     console.log("server")
//     const server = new grpc.Server();

//     server.addService(cartProto.CartService.service, {
//         GetCart: getCartHandler,
//         AddToCart: addToCartHandler,
//         UpdateCartItem: updateCartItemHandler
//     });

//     server.bindAsync('0.0.0.0:50054', grpc.ServerCredentials.createInsecure(), () => {
//         console.log('🚀 gRPC CartService running at 50054');
//         server.start();
//     });
// }

