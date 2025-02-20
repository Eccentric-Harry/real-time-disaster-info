const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'data_processing_group' });
const producer = kafka.producer();

async function processCsvData(data) {
  data.processed = true; // Mark data as processed
  return data;
}

async function consumeAndProcess(topicIn, topicOut) {
  await consumer.connect();
  await producer.connect();
  
  await consumer.subscribe({ topic: topicIn, fromBeginning: true });

  console.log(`✅ Subscribed to topic: ${topicIn}. Waiting for messages...`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const rawData = JSON.parse(message.value.toString());
        const enrichedData = await processCsvData(rawData);

        // Send processed message to another topic
        await producer.send({
          topic: topicOut,
          messages: [{ value: JSON.stringify(enrichedData) }],
        });

        console.log(`🔹 Received & Processed: ${JSON.stringify(enrichedData)}`);
      } catch (err) {
        console.error('❌ Error processing message:', err);
      }
    },
  });
}

// ✅ Export the function instead of running it immediately
module.exports = { consumeAndProcess };