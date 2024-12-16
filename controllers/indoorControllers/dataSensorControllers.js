const dataModel = require("../../models/dataModel")
const detectModel = require("../../models/detectModel")
const deviceModel = require("../../models/deviceModel")
const { 
    temperatureDataListening, 
    humidityDataListening, 
    gasDataListening, 
    flameDataListening, 
    vibrationDataListening, 
    getHistoryData,
    getTemperatureData,
    getGasData,
    getHumidityData
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
const handleGetHistoryData = async (req, res) => {
    try{
        const date = req.body.date
        const page = parseInt(req.query.page)
        const data = await getHistoryData(date, page)
        return res.json(data)
    } catch(err){
        console.log(err)
    }
}
const getTemperatureDataSensor = async (req, res) => {
    try{
        const date = req.body.date
        const page = parseInt(req.query.page)
        const data = await getTemperatureData(date, page)
        return res.json(data)
    } catch(err){
        console.log(err)
    }
}

const getHumidityDataSensor = async (req, res) => {
    try{
        const date = req.body.date
        const page = parseInt(req.query.page)
        const data = await getHumidityData(date, page)
        return res.json(data)
    } catch(err){
        console.log(err)
    }
}

const getGasDataSensor = async (req, res) => {
    try{
        const date = req.body.date
        const page = parseInt(req.query.page)
        const data = await getGasData(date, page)
        return res.json(data)
    } catch(err){
        console.log(err)
    }
}
const getAllIndoorData = async (req, res) => {
    try{
        const date = req.body.date
        const page = parseInt(req.query.page)
        const gasData = await getGasData(date, page)
        const temperatureData = await getTemperatureData(date, page)
        const humidityData = await getHumidityData(date, page)

        return res.json({gasData, temperatureData, humidityData})
    } catch(err){
        console.log(err)
    }
}
const getAllFlameDataSensor = async (req, res) => {

}

const getAllVibrationDataSensor = async (req, res) => {

}

module.exports = { 
    getData, 
    processSensorData, 
    getTemperatureDataSensor, 
    handleGetHistoryData,
    getHumidityDataSensor,
    getGasDataSensor,
    getAllIndoorData
}