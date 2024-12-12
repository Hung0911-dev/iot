require('dotenv').config();
const mongoose = require('mongoose')
const userRoute = require("./routes/userRoute")
const deviceRoute = require("./routes/deviceRoute")
const express = require('express');
const cors = require('cors')
const mongoUri = process.env.MONGO_URI;
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/devices", deviceRoute)

app.get('/', (req, res) => {
    res.status(200).send("MQTT and MongoDB setup are running successfully.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(mongoUri, {
}).then(() => {
    console.log("MongoDB connection established")
}).catch((error) => {
    console.log("MongoDB connection failed: ", error.message);
});