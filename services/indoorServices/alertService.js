const alertModel = require("../../models/alertModel")
const { findDeviceByNameAndSensor } = require("../deviceService")

const saveAlert = async (deviceName, sensorType, message) => {
    try{
        const device = await findDeviceByNameAndSensor(deviceName, sensorType);

        const alert = new alertModel({
            deviceId: device._id,
            sensorType: sensorType,
            alert: message,
        })
    
        await alert.save();
    } catch (error) {
        console.error("Error saving the alert: ", error);
    }
}



module.exports = { saveAlert }