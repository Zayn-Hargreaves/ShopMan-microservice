const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ!');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};

const getChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ() first.');
    }
    return channel;
};

const runProducer = async (topic, message, notiExchange, notiQueue, notiExchangeDLX, notiRoutingKeyDLX) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        // const notiExchange = 'notificationTopicExchange'
        // const notiQueue = 'notificationQueueProcess'
        // const notiExchangeDLX = 'notificationExchangeDLX'
        // const notiRoutingKeyDLX = 'notificationRoutingKeyDLX'

        await channel.assertExchange(notiExchange, 'topic', { durable: true })
        await channel.assertExchange(notiExchangeDLX,'topic', {durable:true} )

        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive:true,
            durable:true,
            deadLetterExchange:notiExchangeDLX,
            deadLetterRoutingKey:notiRoutingKeyDLX
        })
         
        await channel.bindQueue(queueResult.queue, notiExchange, topic)


        channel.publish(notiExchange, topic, Buffer.from(JSON.stringify(message)), {
            expiration:10000
        })
        console.log(`Message sent to topic "${topic}":`, message)
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error sending message to notification service:', error.message);
    }
}

module.exports = { connectRabbitMQ, getChannel, runProducer };