const dataModel = require("../../models/dataModel")
const detectModel = require("../../models/detectModel")
const deviceModel = require("../../models/deviceModel")
const { 
    temperatureDataListening, 
    humidityDataListening, 
    gasDataListening, 
    flameDataListening, 
    vibrationDataListening 
} = require("../../services/indoorServices/indoorService")

async function processSensorData(sensorData){
    try {
        
        const device = await deviceModel.findOne({
            name: sensorData.deviceName,
            typeDevice: sensorData.sensorType
        })
        
        if(device.type == "sensor"){
            const data = new dataModel({
                deviceId: device._id,
                sensorType: device.typeDevice,
                value: sensorData.value
            })
            await data.save()
            return data;
        } else {
            const detect = new detectModel({
                deviceId: device._id,
                sensorType: device.typeDevice,
                value: sensorData.value
            })
            await detect.save()
            return detect;
        }

    } catch (error){
        console.error("Error processing and updating sensor data: ", error)
    }
}

const getDataSensor = async (deviceId) => {
    try {
        const sensorData = await dataModel.findOne({deviceId})
        return sensorData;
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const getDetectSensor = async (deviceId) => {
    try {
        const detectData = await detectModel.findOne({deviceId})
        return detectData;
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const getData = async (req, res) => {
    const deviceId = req.params.deviceId;
    try{
        const device = await deviceModel.findById(deviceId)
        if(device.type === "sensor"){
            const data = await getDataSensor(deviceId);
            return data;
        } else {
            const data = await getDetectSensor(deviceId);
            return data;
        }
    }catch(error){
        console.log(error)
    }
}

const getTemperatureDataSensor = async (req, res) => {
    try{
        const userId = req.params.userId;
        const data = await temperatureDataListening(userId);
        if (!data) {
            return res.status(404).json({
                message: "No temperature data found"
            });
        }
        res.status(200).json({
            message: "Temperature data collected",
            data: data,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}

const getHumidityDataSensor = async (req, res) => {
    try{
        const userId = req.params.userId;
        const data = await humidityDataListening(userId);
        if (!data) {
            return res.status(404).json({
                message: "No humidity data found"
            });
        }
        res.status(200).json({
            message: "Humidity data collected",
            data: data,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}

const getGasDataSensor = async (req, res) => {
    try{
        const userId = req.params.userId;
        const data = await gasDataListening(userId);
        if (!data) {
            return res.status(404).json({
                message: "No gas data found"
            });
        }
        res.status(200).json({
            message: "Gas data collected",
            data: data,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}

const getFlameDataSensor = async (req, res) => {
    try{
        const userId = req.params.userId;
        const data = await flameDataListening(userId);
        if (!data) {
            return res.status(404).json({
                message: "No flame data found"
            });
        }
        res.status(200).json({
            message: "Flame data collected",
            data: data,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}

const getVibrationDataSensor = async (req, res) => {
    try{
        const userId = req.params.userId;
        const data = await vibrationDataListening(userId);
        if (!data) {
            return res.status(404).json({
                message: "No vibration data found"
            });
        }
        res.status(200).json({
            message: "Vibration data collected",
            data: data,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}

module.exports = { 
    getData, 
    processSensorData, 
    getTemperatureDataSensor, 
    getGasDataSensor, 
    getHumidityDataSensor, 
    getVibrationDataSensor,
    getFlameDataSensor
}