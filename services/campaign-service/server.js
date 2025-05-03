// gia lap server
// tạm file test: product-service/server.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/product.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

const server = new grpc.Server();

server.addService(productProto.ProductService.service, {
    GetProduct: (call, callback) => {
        const id = call.request.id;
        callback(null, { id, name: 'Sản phẩm mẫu', price: 99000 });
    },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('🟢 gRPC product-service running on port 50051');
    server.start();
});
