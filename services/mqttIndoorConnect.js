require('dotenv').config();
const mqtt = require("mqtt");
const { saveAvgDataByDevice, processMessage } = require('./indoorServices/dataService');

const brokerUrl = process.env.BROKER_URL;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;

// Connect to Hive Broker

async function connectToMqttBroker(io) {
    return new Promise((resolve, reject) => {
        const options = {
            clientId: `Math.random().toString(16).substr(2, 8)`,
            clean: true,
            connectTimeout: 5000,
            username: mqttUsername,
            password: mqttPassword
        };

        const topics = [
            'Iot_InDoor/temperature',
            'Iot_InDoor/humidity',
            'Iot_InDoor/gas',
            'Iot_InDoor/flame',
            'Iot_InDoor/vibration',
        ];

        const mqttClient = mqtt.connect(brokerUrl, options);

        mqttClient.on('connect', () => {
            
            console.log(`Connected to MQTT broker!`);

            mqttClient.subscribe(topics, { qos: 1 }, (err) => {
                if (err) {
                    reject('Subscription error:', err);
                } else {
                    console.log(`Successfully subscribed to topics: ${topics.join(', ')}`);
                    resolve(mqttClient)
                }
            });
        });

        mqttClient.on('message', async (topic, message) => {
            try {
                const jsonString = message.toString();
                const jsonData = JSON.parse(jsonString);

                console.log(`Received JSON message on topic '${topic}':`, jsonData);

                processMessage(jsonData)

                // Emit the data to clients via Socket.IO
                io.emit(topic, jsonData);

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
