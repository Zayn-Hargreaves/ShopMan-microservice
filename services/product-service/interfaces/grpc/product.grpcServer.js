const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { GetProductsBySkuList } = require('./productGrpcHandler');

const PROTO_PATH = path.join(__dirname, './product.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).product;

function startGrpcServer() {
    const server = new grpc.Server();

    server.addService(proto.ProductService.service, {
        GetProductsBySkuList,
    });

    server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
        console.log('🚀 gRPC ProductService running at 50052');
        server.start();
    });
}

module.exports = { startGrpcServer };
