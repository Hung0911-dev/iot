const mqtt = require('mqtt');

// HiveMQ Cloud cluster URL
const brokerUrl = 'mqtts://1836f558f34d4320967bb0f1afe9b517.s1.eu.hivemq.cloud:8883';

// MQTT options with username and password
const options = {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`, // Unique client ID
  clean: true, // Clean session
  connectTimeout: 4000, // Connection timeout
  username: 'Hung091103', // Username
  password: 'Hung091103', // Password
};

// Connect to the broker
const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
  console.log('Connected to HiveMQ Cloud.');

  // Subscribe to the 'Iot_InDoor' topic
  const topic = 'Iot_InDoor/alerts';
  client.subscribe(topic, { qos: 1 }, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error('Subscription error:', err);
    }
  });
});

// Handle incoming messages
client.on('message', (topic, message) => {
  console.log(`Received message from topic "${topic}":`);
  console.log(JSON.parse(message.toString())); // Parsing the JSON message
});

// Handle connection errors
client.on('error', (err) => {
  console.error('Connection error:', err);
});

// Handle disconnection
client.on('close', () => {
  console.log('Disconnected from HiveMQ Cloud.');
});
