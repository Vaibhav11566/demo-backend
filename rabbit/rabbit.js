
// rabbit.js
const amqp = require("amqplib");

let channel;
const queueName = "user_events"; // apna queue naam

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672"); // agar docker container hai toh docker internal host use karo
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    console.log("✅ RabbitMQ Connected & Queue Ready:", queueName);
  } catch (err) {
    console.error("❌ RabbitMQ connection error:", err);
  }
}

function publishToQueue(msg) {
  if (!channel) {
    console.error("❌ No RabbitMQ channel found");
    return;
  }
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), {
    persistent: true,
  });
  console.log("📩 Message sent to queue:", msg);
}

module.exports = { connectRabbitMQ, publishToQueue };
