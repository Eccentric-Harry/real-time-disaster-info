const { Kafka } = require("kafkajs");
const axios = require("axios");

const kafka = new Kafka({
  clientId: "disaster-classification",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "classification-group" });
const producer = kafka.producer();

const classifyText = async (text) => {
  try {
    const response = await axios.post("http://localhost:8000/classify", { text });
    return response.data.label;
  } catch (error) {
    console.error("Error calling ML API:", error);
    return "unknown"; // Fallback label
  }
};

const processMessages = async () => {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: "csv_raw_data", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const text = message.value.toString();
      console.log(`Received: ${text}`);

      // Call Python API for classification
      const label = await classifyText(text);
      console.log(`Classified as: ${label}`);

      // Send classified data to another Kafka topic
      await producer.send({
        topic: "classified_csv_data",
        messages: [{ value: JSON.stringify({ text, label }) }],
      });

      console.log("Sent to classified_disaster_data topic");
    },
  });
};

processMessages().catch(console.error);
