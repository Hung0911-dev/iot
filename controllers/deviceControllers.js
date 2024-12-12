const deviceModel = require("../models/deviceModel");

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

        res.status(200).json({
            _id: device._id, 
            userId,
            name, 
            location, 
            status, 
            typeDevice, 
            type
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
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

const getDevice = async (req, res) => {
    try{
        const devices = await deviceModel.find();
        res.status(200).json(devices);
    } catch (error){
        console.log(error);
        res.status(500).json(error)
    }
}

module.exports = { registerDevice, findDevice, getDevice }