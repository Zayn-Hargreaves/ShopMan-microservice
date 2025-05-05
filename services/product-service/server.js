require('dotenv').config();
const express = require('express');
const app = express();
const productRoutes = require("./interfaces/rest/product.route")
const {startGrpcServer} = require("./interfaces/grpc/product.grpcServer")


app.use((err, req, res, next) => {
    console.log('🛑 JSON parse error?', err.message);
    next(err);
});
app.use((req, res, next) => {
    console.log('🔍 Request received:', req.method, req.originalUrl);
    next();
});




app.use(express.json());

app.use('/product', productRoutes);
startGrpcServer()

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});