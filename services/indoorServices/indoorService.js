const { connectToMqttBroker } = require("../mqttIndoorConnect")

async function temperatureDataListening(io) {

    const topic = "Iot_InDoor/temperature"

    try {
        await connectToMqttBroker(topic, io);
    } catch (error){
        console.log('Error in MQTT Client', error);
    }
}

async function humidityDataListening(io) {

    const topic = "Iot_InDoor/humidity"

    try {
        await connectToMqttBroker(topic, io);
    } catch (error){
        console.log('Error in MQTT Client', error);
    }
}

async function gasDataListening(io) {

    const topic = "Iot_InDoor/gas"

    try {
        await connectToMqttBroker(topic, io);
    } catch (error){
        console.log('Error in MQTT Client', error);
    }
}

async function flameDataListening(io) {

    const topic = "Iot_InDoor/flame"

    try {
        await connectToMqttBroker(topic, io);
    } catch (error){
        console.log('Error in MQTT Client', error);
    }
}

async function vibrationDataListening(io) {

    const topic = "Iot_InDoor/vibration"

    try {
        await connectToMqttBroker(topic, io);
    } catch (error){
        console.log('Error in MQTT Client', error);
    }
}

module.exports = { 
    temperatureDataListening, 
    humidityDataListening, 
    gasDataListening, 
    flameDataListening, 
    vibrationDataListening
}