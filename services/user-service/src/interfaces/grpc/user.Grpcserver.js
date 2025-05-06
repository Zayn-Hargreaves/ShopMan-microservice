const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const AuthService = require('../../application/auth.service'); 

const packageDefinition = protoLoader.loadSync(
    path.resolve(__dirname, './user.proto'),
    { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;

const server = new grpc.Server();

server.addService(userProto.service, {
    Signup: async (call, callback) => {
        try {
            const result = await AuthService.signUp(call.request);
            callback(null, {
                message: "Sign up success",
                access_token:result.tokens.accessToken,
                refresh_token:result.tokens.refreshToken,
                user_id: result.user.id,
                email: result.user.email,
                name: result.user.name
            });
        } catch (err) {
            callback(err, null);
        }
    },
    Login: async (call, callback) => {
        try {
            const result = await AuthService.login(call.request);
            callback(null, {
                message: "Login success",
                access_token:result.tokens.accessToken,
                refresh_token:result.tokens.refreshToken,
                user_id: result.user.id,
                email: result.user.email,
                name: result.user.name
            });
        } catch (err) {
            callback(err, null);
        }
    },
    RefreshToken: async (call, callback) => {
        try {
            const result = await AuthService.HandleRefreshToken(call.request.refresh_token);
            callback(null, {
                message: "Refresh token success",
                access_token:result.accessToken,
                refresh_token:result.refreshToken,
            });
        } catch (err) {
            callback(err, null);
        }
    }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log("gRPC user-service running on port 50051");
});