const { findDeviceByNameAndSensor } = require("../deviceService")
const dataModel = require("../../models/dataModel")
const detectModel = require("../../models/detectModel");
const InDoor = require("../../models/InDoor");
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
        case 'flame':
          mappedData.flame = {
            deviceId: device._id,
            value: Boolean(item.value) 
          };
          break;
        case 'vibration':
            mappedData.vibration = {
              deviceId: device._id,
              value: Boolean(item.value) 
            };
        break;
        case 'gas':
          mappedData.gas = {
            deviceId: device._id,
            value: item.value
          };
          break;
      }
    }
    return mappedData
}
const savedData = async () => {
    const newIndoor = new InDoor(mappedData)
    const savedData = await newIndoor.save()
    return savedData
}
setInterval(
    savedData
, 1000*60*5);

module.exports = { processMessage }