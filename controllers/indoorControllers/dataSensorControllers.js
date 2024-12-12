require('dotenv').config();

const dataModel = require("../../models/deviceModel");
const mqtt = require("mqtt");
const router = express.Router()

const brokerUrl = process.env.BROKER_URL;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;

const options = {
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    clean: true,
    connectTimeout: 5000,
    username: mqttUsername,
    password: mqttPassword
};

// Connect to Hive Broker
const client = mqtt.connect(brokerUrl, options);

