require('dotenv').config();
const mqtt = require("mqtt");
const dataModel = require("../models/dataModel");
const { findDeviceByNameAndSensor } = require('../controllers/deviceControllers');

const brokerUrl = process.env.BROKER_URL;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;

// Connect to Hive Broker

async function connectToMqttBroker(topic, io) {
    return new Promise((resolve, reject) => {
        const options = {
            clientId: `Math.random().toString(16).substr(2, 8)`,
            clean: true,
            connectTimeout: 5000,
            username: mqttUsername,
            password: mqttPassword
        };

        const mqttClient = mqtt.connect(brokerUrl, options);

        mqttClient.on('connect', () => {
            
            console.log(`Connected to MQTT broker!`);

            mqttClient.subscribe(topic, { qos: 1 }, (err) => {
                if (err) {
                    reject('Subscription error:', err);
                } else {
                    console.log(`Successfully subscribed to topic: ${topic}`);
                }
            });
        });

        mqttClient.on('message', async (topic, message) => {
            try {
                const jsonString = message.toString();
                const jsonData = JSON.parse(jsonString);

                console.log(`Received JSON message on topic '${topic}':`, jsonData);

                const device = await findDeviceByNameAndSensor(jsonData.deviceName, jsonData.sensorType)

                // Save the data to MongoDB
                // const newData = new dataModel({
                //     deviceId: device._id,
                //     sensorType: device.sensorType,
                //     value: device.value,
                // });

                // await newData.save();
                // console.log("Data saved to MongoDB:", newData);

                io.emit(`${topic}`, jsonData)

                resolve(jsonData);
            } catch (error) {
                console.error('Error parsing JSON message:', error);
            }
        });

        // Handle connection errors
        mqttClient.on('error', (err) => {
            console.error('Connection error:', err);
        });
        
        // Handle disconnection
        mqttClient.on('close', () => {
            console.log('Disconnected from HiveMQ Cloud.');
        });
    }) 
}

module.exports = { connectToMqttBroker }
