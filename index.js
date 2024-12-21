require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express');
const cors = require('cors');

const userRoute = require("./routes/userRoute");
const deviceRoute = require("./routes/deviceRoute");
const indoorRoute = require("./routes/indoor/indoorRoute");
const userInteractRoute = require("./routes/userInteractRoute");
const outdoorRoute = require("./routes/outdoor/outdoorRoute")
const {
  connectToMqttBrokerIndoor
} = require('./services/mqttIndoorConnect');

const { createWebSocketServer } = require('./sockets/websocketServer');
const Outdoor = require('./models/Outdoor');
const InDoor = require('./models/InDoor');
const { connectToMqttBrokerOutdoor } = require('./services/mqttOutdoorConnect');

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT

const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/users", userRoute);
app.use("/api/devices", deviceRoute);
app.use("/api/indoor", indoorRoute);
app.use("/api/controll", userInteractRoute);
app.use("/api/outdoor", outdoorRoute)
// Received the mqtt data from topic
const io = createWebSocketServer();
connectToMqttBrokerIndoor(io);
connectToMqttBrokerOutdoor(io);

app.get('/', (req, res) => {
    res.status(200).send("MQTT and MongoDB setup are running successfully.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

mongoose.connect(mongoUri, {
}).then(() => {
    const outdoor = new InDoor({
        temperature: {
            deviceId: "675aac3c5a5c76cac0e428c9",
            value: 28
        },
        humidity: {
            deviceId: "675aac3c5a5c76cac0e428c9",
            value: 43
        },
        gasValue: {
            deviceId: "675aac3c5a5c76cac0e428c9",
            value: 43
        },
        fire: {
            deviceId: "675aac3c5a5c76cac0e428c9",
            value: false
        },
        vibration: {
            deviceId: "675aac3c5a5c76cac0e428c9",
            value: false
        },
    })
    outdoor.save()
    console.log("MongoDB connection established")
}).catch((error) => {
    console.log("MongoDB connection failed: ", error.message);
});
