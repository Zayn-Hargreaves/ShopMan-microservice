// interfaces/events/consumers/orderCreated.consumer.js

const {runConsumer} = require("../../infratructure/rabbit mq/rabbitmq");
const ProductService = require("../../application/services/notification.service.js");

const EXCHANGE = "userEvents";
const QUEUE = "notificationEventsQueue";
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
            await ProductService.NotiToUser(message);
        }
    );
}

module.exports = { startOrderCreatedConsumer };
