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

app.use(express.json());
app.use(cors());


app.use("/api/users", userRoute);
app.use("/api/devices", deviceRoute);
app.use("/api/indoor", indoorRoute);

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
    console.log("MongoDB connection established")
}).catch((error) => {
    console.log("MongoDB connection failed: ", error.message);
});
