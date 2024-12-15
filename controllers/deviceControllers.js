const deviceModel = require("../models/deviceModel");
const dataModel = require("../models/dataModel");
const detectModel = require("../models/detectModel")

const registerDevice = async (req, res) => {
    const { userId, name, location, status, typeDevice, type } = req.body

    try {
        let device = await deviceModel.findOne({name: name, typeDevice: typeDevice})
        if(device) return res.status(400).json("Device have already registerd !")
        
        if(!userId || !name || !location || !status || !typeDevice || !type) {
            return res.status(400).json("All field are required")
        }

        device = new deviceModel({
            userId: userId,
            name: name,
            location: location,
            status: status,
            typeDevice: typeDevice,
            type: type
        })

        await device.save()

        if(type === "sensor"){
            const data = new dataModel({
                deviceId: device._id,
                sensorType: type,
            })
            await data.save()
        } else {
            const detect = new detectModel({
                deviceId: device._id,
                sensorType: type,
            })
            await detect.save()
        }

        res.status(200).json({
            device: {
                _id: device._id, 
                userId,
                name, 
                location, 
                status, 
                typeDevice, 
                type
            }
        })
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

const findDevice = async (req, res) => {
    const deviceId = req.params.deviceId;
    try {
        const device = await deviceModel.findById(deviceId)
        res.status(200).json(device);
        return device;
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

const getDevice = async (req, res) => {
    try{
        const devices = await deviceModel.find();
        // res.status(200).json(devices);
        return devices;
    } catch (error){
        console.log(error);
        res.status(500).json(error)
    }
}

const findDeviceByNameAndSensor = async (name, typeDevice) => {
    try{
        const device = await deviceModel.findOne({
            name: name,
            typeDevice: typeDevice
        })
        return device;
    } catch (error) {
        console.log(error)
    }
}

module.exports = { registerDevice, findDevice, getDevice, findDeviceByNameAndSensor }