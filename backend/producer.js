const fs = require('fs');
const { Kafka } = require('kafkajs');
const csv = require('csv-parser');
const path = require('path'); // Import the 'path' module

// Kafka configuration
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function deliveryReport(err, msg) {
  if (err) {
    console.log(`Message delivery failed: ${err}`);
  } else {
    console.log(`Message delivered to ${msg.topic} [${msg.partition}]`);
  }
}

async function streamCsvToKafka(csvPath, topic) {
  if (!fs.existsSync(csvPath)) {
    console.log(`File not found: ${csvPath}`);
    return;
  }

  // Connect Kafka producer
  await producer.connect();

  const readStream = fs.createReadStream(csvPath);
  let rowCount = 0;

  readStream.pipe(csv())
    .on('data', async (row) => {
      rowCount++;
      try {
        // Send each row to Kafka topic
        await producer.send({
          topic,
          messages: [
            {
              value: JSON.stringify(row), // Convert row to JSON string
            },
          ],
        }, deliveryReport);
        console.log(`Row ${rowCount} sent to ${topic}`);
        
        // Simulate streaming delay every 10 rows
        if (rowCount % 10 === 0) {
          console.log(`Chunk of 10 rows sent to ${topic}. Waiting for 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for simulation
        }
      } catch (err) {
        console.error('Error sending message to Kafka:', err);
      }
    })
    .on('end', async () => {
      console.log('CSV file processing completed');
      await producer.disconnect(); // Disconnect producer when done
    })
    .on('error', (err) => {
      console.error('Error processing CSV file:', err);
    });
}

(async () => {
  const csvFile = path.join(__dirname, 'scripts', 'data', 'tweets.csv'); // Correct path to CSV file
  const kafkaTopic = 'csv_raw_data';
  await streamCsvToKafka(csvFile, kafkaTopic);
})();
