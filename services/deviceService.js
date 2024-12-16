const deviceModel = require("../models/deviceModel");

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

module.exports = { findDeviceByNameAndSensor };