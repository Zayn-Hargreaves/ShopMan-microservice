const { runConsumer } = require("../../infratructure/rabbitmq/rabbitmq");
const CartService = require("../../application/services/cart.service");

const EXCHANGE = "userEvents";
const QUEUE = "cartInitQueue";
const DLX_EXCHANGE = "userEventsDLX";
const DLX_ROUTING_KEY = "userEventsDLX.routingKey";
const ROUTING_KEY = "user.created";

async function startUserCreatedConsumer() {
    await runConsumer(
        EXCHANGE,
        QUEUE,
        DLX_EXCHANGE,
        DLX_ROUTING_KEY,
        ROUTING_KEY,
        async (message) => {
            const { UserId } = message;
            if (!UserId) throw new Error("Missing userId in message");
            console.log(UserId)
            await CartService.createCartIfNotExist(UserId);
        }
    );
}

module.exports = { startUserCreatedConsumer };
