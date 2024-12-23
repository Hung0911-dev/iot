require('dotenv').config();
const mqtt = require("mqtt");
const { saveAvgDataByDevice, processMessage } = require('./indoorServices/dataService');
const { saveAlert } = require('./indoorServices/alertService');
const { makeCall } = require('./voiceCallService');

const brokerUrl = process.env.BROKER_URL;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;


async function connectToMqttBrokerIndoor(io) {
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
            'Iot_InDoor/alert',
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
        let inDoorDataArray = []
        let countInDoorData = 0;
        mqttClient.on('message', async (topic, message) => {
            try {
                const jsonString = message.toString();
                const jsonData = JSON.parse(jsonString);

                console.log(`Received JSON message on topic '${topic}':`, jsonData);
                io.emit(topic, jsonData);
                if(countInDoorData === 4){
                    processMessage(inDoorDataArray)
                    countInDoorData = 0
                    inDoorDataArray = []
                } else {
                    inDoorDataArray.push(jsonData)
                    countInDoorData++;
                }
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

module.exports = { connectToMqttBrokerIndoor }
