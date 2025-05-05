// interfaces/events/consumers/orderCreated.consumer.js

const {runConsumer} = require("../../infratructure/rabbitmq/rabbitmq");
const CartService = require("../../application/services/cart.service");

const EXCHANGE = "userEvents";
const QUEUE = "cartEventsQueue";
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
            await CartService.sendOrderConfirmationEmail(message);
        }
    );
}

module.exports = { startOrderCreatedConsumer };
