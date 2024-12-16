const { findDeviceByNameAndSensor } = require("../deviceService")
const dataModel = require("../../models/dataModel")
const detectModel = require("../../models/detectModel")

const sensorDataStore = {
    'temperature': [],
    'humidity': [],
    'gas': [],
    'flame': [],
    'vibration': []
}

function calculateAverageByDevice(sensorData) {

    const groupedByDevice = sensorData.reduce((acc, { deviceName, value }) => {
        if (!acc[deviceName]) {
            acc[deviceName] = [];
        }
        acc[deviceName].push(value);
        return acc;
    }, {});

    const averages = Object.entries(groupedByDevice).map(([deviceName, values]) => {
        const sum = values.reduce((acc, val) => acc + val, 0);
        const avg = sum / values.length;
        return { deviceName, average: avg };
    });

    return averages;
}

function processMessage(jsonData) {
    if (jsonData.value !== undefined && jsonData.value > 0) {

        const { deviceName, sensorType, value } = jsonData;

        if(sensorDataStore[sensorType]){
            sensorDataStore[sensorType].push({deviceName, value})
        }
    }
}

const saveAvgDataByDevice = async (deviceName, sensorType, value) => {
    
    try{
        const device = await findDeviceByNameAndSensor(deviceName, sensorType);
        
        if(device.type === "sensor"){
            const newData = new dataModel({
                deviceId: device._id,
                sensorType: sensorType,
                value: value
            })
    
            await newData.save();
            console.log("Data saved to MongoDB: ", newData);
        }

        if(device.type === "detect"){
            const newData = new detectModel({
                deviceId: device._id,
                sensorType: sensorType,
                value: value
            })
    
            await newData.save();
            console.log("Data saved to MongoDB: ", newData);
        }
        
    } catch (error) {
        console.log(error)
    }
}

async function saveAverageData() {
    for (const sensorType in sensorDataStore) {
        if (sensorDataStore[sensorType].length > 0) {

            const averagesByDevice = calculateAverageByDevice(sensorDataStore[sensorType]);

            for (const { deviceName, average } of averagesByDevice) {
                await saveAvgDataByDevice(deviceName, sensorType, average);
            }

            sensorDataStore[sensorType] = [];
        }
    }
}



setInterval(saveAverageData, 60*1000); // 1 hour in milliseconds

module.exports = { saveAvgDataByDevice, processMessage }