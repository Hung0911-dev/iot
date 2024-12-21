const { findDeviceByNameAndSensor } = require("../deviceService")
const dataModel = require("../../models/dataModel")
const detectModel = require("../../models/detectModel");
const InDoor = require("../../models/InDoor");
const Outdoor = require("../../models/Outdoor");
const Device = require("../../models/deviceModel");

const mappedData = {};


async function processMessage(jsonData) {

    for (const item of jsonData) {
      const device = await Device.findOne({ name: item.deviceName }); // Find deviceId by name
      if (!device) {
        throw new Error(`Device ${item.deviceName} not found`);
      }

      switch (item.sensorType) {
        case 'temperature':
          mappedData.temperature = {
            deviceId: device._id,
            value: item.value
          };
          break;
        case 'humidity':
          mappedData.humidity = {
            deviceId: device._id,
            value: item.value
          };
          break;
        case 'motion':
          mappedData.motionDetect = {
            deviceId: device._id,
            value: Boolean(item.value) 
          };
          break;
        case 'air':
          mappedData.airQuality = {
            deviceId: device._id,
            value: item.value
          };
          break;
      }
    }
    return mappedData
}
const savedData = async () => {
    const newOutdoor = new Outdoor(mappedData)
    const savedData = await newOutdoor.save()
    return savedData
}
setInterval(
    savedData
, 1000*60);

module.exports = { processMessage }