require('dotenv').config();
const express = require('express');
const app = express();
const productRoutes = require("./src/interfaces/rest/product.route")
const {startOrderCreatedConsumer} = require("./src/interfaces/rabbit mq/orderCreated.consumer")
require("./src/interfaces/grpc/product.grpcServer")

app.use((err, req, res, next) => {
    console.log('🛑 JSON parse error?', err.message);
    next(err);
});
app.use((req, res, next) => {
    console.log('🔍 Request received:', req.method, req.originalUrl);
    next();
});


async function bootstrap() {
    await startOrderCreatedConsumer()
}
bootstrap()

app.use(express.json());

app.use('/product', productRoutes);



const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});