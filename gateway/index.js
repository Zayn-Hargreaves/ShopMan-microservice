// api-gateway/index.js
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const attachRequestId = require('./src/shared/middleware/request-id');
const logger = require('./src/shared/middleware/logger');
const { connectProducer } = require('./src/infratructure/rabbitmq/producer');
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
// api-gateway/index.js
require('./src/interfaces/rest/dynamic.routes')(app);
require('./src/interfaces/rest/index.routes')(app)





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`🚀 API Gateway running on port ${PORT}`);
});
