require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express');
const cors = require('cors');

const userRoute = require("./routes/userRoute");
const deviceRoute = require("./routes/deviceRoute");
const indoorRoute = require("./routes/indoor/indoorRoute");

const {
    connectToMqttBroker
} = require('./services/mqttIndoorConnect');

const { createWebSocketServer } = require('./sockets/websocketServer');

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT

const app = express();
const PORT = 8000;
const mqtt = require('mqtt')


app.use(express.json());
app.use(cors());


app.use("/api/users", userRoute);
app.use("/api/devices", deviceRoute);
app.use("/api/data", indoorRoute);

// Received the mqtt data from topic
const io = createWebSocketServer();
connectToMqttBroker(io);

app.get('/', (req, res) => {
    res.status(200).send("MQTT and MongoDB setup are running successfully.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

mongoose.connect(mongoUri, {
}).then(() => {
    const brokerUrl = 'mqtts://1836f558f34d4320967bb0f1afe9b517.s1.eu.hivemq.cloud:8883';
 
const options = {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`, 
  clean: true, 
  connectTimeout: 4000,
  username: 'Hung091103', 
  password: 'Hung091103', 
};
 
const client = mqtt.connect(brokerUrl, options);
 
client.on('connect', () => {
  console.log('Connected to HiveMQ Cloud.');
 
  const topic = 'Iot_InDoor';
  client.subscribe(topic, { qos: 1 }, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error('Subscription error:', err);
    }
  });
});
 
client.on('message', (topic, message) => {
  console.log(`Received message from topic "${topic}":`);
  console.log(JSON.parse(message.toString()));
});
 
client.on('error', (err) => {
  console.error('Connection error:', err);
});
 
client.on('close', () => {
  console.log('Disconnected from HiveMQ Cloud.');
});
    console.log("MongoDB connection established")
}).catch((error) => {
    console.log("MongoDB connection failed: ", error.message);
});
