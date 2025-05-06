require('dotenv').config();
const express = require('express');
const app = express();
const { startOrderCreatedConsumer } = require('./src/interefaces/rabbit mq/orderCreated.consumer');
const initializeModels = require('./src/application/model');


app.use((err, req, res, next) => {
    console.log('🛑 JSON parse error?', err.message);
    next(err);
});
app.use((req, res, next) => {
    console.log('🔍 Request received:', req.method, req.originalUrl);
    next();
});




app.use(express.json());

async function bootstrap() {
    await initializeModels()
    await startOrderCreatedConsumer()
}
bootstrap()
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});