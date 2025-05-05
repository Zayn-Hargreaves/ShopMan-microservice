const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, './user.proto'),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;

const client = new userProto('localhost:50051', grpc.credentials.createInsecure());

module.exports = client;