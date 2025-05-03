// infrastructure/rabbitmq/producer.js
const amqp = require('amqplib');

let channel;

async function connectProducer() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();

    // Đảm bảo exchange tồn tại
    const exchangeName = 'user-events';
    await channel.assertExchange(exchangeName, 'fanout', { durable: true });

    console.log('✅ RabbitMQ Producer connected');
}

async function emitUserEvent(eventName, payload) {
    const exchangeName = 'user-events';
    const message = Buffer.from(JSON.stringify({ event: eventName, ...payload }));
    channel.publish(exchangeName, '', message); // routingKey là '' vì dùng fanout
}

module.exports = {
    connectProducer,
    emitUserEvent,
};
