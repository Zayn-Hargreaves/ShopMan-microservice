

require('dotenv').config();
const express = require('express');
const app = express();
const OrderRoutes = require("./interfaces/rest/order.route")
require("./interfaces/grpc/order/order.grpcServer")

app.use((err, req, res, next) => {
    console.log('🛑 JSON parse error?', err.message);
    next(err);
});
app.use((req, res, next) => {
    console.log('🔍 Request received:', req.method, req.originalUrl);
    next();
});




app.use(express.json());

app.use('/', OrderRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});