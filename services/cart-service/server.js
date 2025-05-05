require('dotenv').config();
const express = require('express');
const app = express();
const CartRoutes = require("./interfaces/rest/cart.route.js")
const {startOrderCreatedConsumer} = require("./interfaces/rabbit mq/orderCreated.consumer.js")
const {startUserCreatedConsumer } = require("./interfaces/rabbit mq/userCreated.consumer.js")
require("./interfaces/grpc/cart/cartGrpcServer.js")
app.use((err, req, res, next) => {
    console.log('🛑 JSON parse error?', err.message);
    next(err);
});
app.use((req, res, next) => {
    console.log('🔍 Request received:', req.method, req.originalUrl);
    next();
});




app.use(express.json());

app.use("/", CartRoutes )

async function bootstrap() {
    await startOrderCreatedConsumer()
    await startUserCreatedConsumer()
}
bootstrap()
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});