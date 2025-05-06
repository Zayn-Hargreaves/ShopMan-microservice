// interfaces/events/consumers/orderCreated.consumer.js

const {runConsumer} = require("./rabbitmq");
const ProductService = require("../../application/service/product.service");

const EXCHANGE = "userEvents";
const QUEUE = "productEventsQueue";
const DLX_EXCHANGE = "userEventsDLX";
const DLX_ROUTING_KEY = "userEventsDLX.routingKey";
const ROUTING_KEY = "order.created";

async function startOrderCreatedConsumer() {
    await runConsumer(
        EXCHANGE,
        QUEUE,
        DLX_EXCHANGE,
        DLX_ROUTING_KEY,
        ROUTING_KEY,
        async (message) => {
            await ProductService.handleOrderCreated(message);
        }
    );
}

module.exports = { startOrderCreatedConsumer };
