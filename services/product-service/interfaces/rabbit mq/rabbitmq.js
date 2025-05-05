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



const runConsumer = async (notiExchange, notiQueue, notiExchangeDLX, notiRoutingKeyDLX, routingKey) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Declare exchange chính
        await channel.assertExchange(notiExchange, 'topic', { durable: true });

        // Declare DLX
        await channel.assertExchange(notiExchangeDLX, 'topic', { durable: true });

        // Declare queue có gắn DLX
        const q = await channel.assertQueue(notiQueue, {
            durable: true,
            deadLetterExchange: notiExchangeDLX,
            deadLetterRoutingKey: notiRoutingKeyDLX
        });

        // Bind queue với routing key
        await channel.bindQueue(q.queue, notiExchange, routingKey);

        // Consume message
        channel.consume(q.queue, async(msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log(`✅ Received message [${routingKey}]:`, data);

                try {
                    await NotificationService.handleUserCreated(data);  // 👉 logic ở tầng Application
                    channel.ack(msg);
                } catch (error) {
                    console.error("❌ Failed to process message:", error);
                    channel.nack(msg, false, false);
                }
            }
        });

        console.log(`🚀 Consumer listening on queue "${notiQueue}" with routingKey "${routingKey}"`);
    } catch (error) {
        console.error('❌ Consumer error:', error.message);
    }
};

// Khởi chạy consumer với các tham số cụ thể
// runConsumer('notificationTopicExchange', 'notificationQueueProcess', 'your.routing.key');



module.exports = { connectRabbitMQ, getChannel, runProducer, runConsumer };