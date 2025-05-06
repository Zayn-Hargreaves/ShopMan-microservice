// api-gateway/index.js
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const attachRequestId = require('./src/shared/middleware/request-id');
const logger = require('./src/shared/middleware/logger');
const { connectProducer } = require('./src/infratructure/rabbitmq/producer');
const userRoutes = require("./src/interfaces/rest/user.router")
const CartRoutes = require("./src/interfaces/rest/cart.router")
const OrderRoutes = require("./src/interfaces/rest/order.router")
const ProductRoutes = require("./src/interfaces/rest/product.route");
const authenticateToken = require('./src/shared/middleware/auth');
const app = express();

app.use(attachRequestId); // Add request ID
app.use(morgan('dev'));

// Custom log mỗi request
app.use((req, res, next) => {
    logger.info(`[${req.requestId}] ${req.method} ${req.originalUrl}`);
    next();
});
connectProducer().catch(console.error);
// Rate limit toàn hệ thống
app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 100
}));
app.use(express.json())
app.use("/user",userRoutes)
app.use("/product",ProductRoutes)
app.use(authenticateToken)
app.use("/cart", CartRoutes)
app.use("/Order", OrderRoutes)





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`🚀 API Gateway running on port ${PORT}`);
});
