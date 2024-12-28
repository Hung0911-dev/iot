const userInteractModel = require("../../models/userInteractModel")
const { findDeviceByNameAndSensor } = require("../deviceService");
const deviceModel = require("../../models/deviceModel")

const mqtt = require('mqtt');
const Device = require("../../models/deviceModel");
const mqttBrokerUrl = 'mqtts://eb95b651127d4e39afc7f2150b88a296.s1.eu.hivemq.cloud:8883';
const mqttOptions = {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  clean: true,
  connectTimeout: 5000,
  username: 'Hung091103', 
  password: 'Hung091103', 
};

const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);
const controlLight = async (userId, command) => {
  const controlTopic = 'Iot_OutDoor/Led_Control';
  const ledDevice = await Device.findOne({name: "LED"})
  const payload = JSON.stringify({
    command: command,
});

  mqttClient.publish(controlTopic, payload, { qos: 1 }, (err) => {
    if (err) {
      console.error('Failed to publish MQTT message:', err);
    }
    saveUserInteract(ledDevice._id, `Light turn-${command}`, userId);
    if(command === "ON"){
      updateLightDevice(true);
    } else {
      updateLightDevice(false);
    }
    console.log(`Light turn-${command} command sent:`, payload);

  });
}

const saveUserInteract = async(device, action, userId) => {
    try{

        const userInteract = new userInteractModel({
            userId: userId,
            device: device,
            action: action
        })
    
        await userInteract.save()
    } catch (error) {
        console.log(error);
    }
}
const getOutdoorInteract = async (dateFilter) => {
  let query = {};
  let groupBy = {};
    if (dateFilter) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
        const startOfDay = new Date(dateFilter);
        const endOfDay = new Date(dateFilter);
        endOfDay.setHours(23, 59, 59, 999);
        query = { createdAt: { $gte: startOfDay, $lte: endOfDay }};
        groupBy = { hour: { $hour: "$createdAt" }};
      }
      else if (/^\d{4}-\d{2}$/.test(dateFilter)) {
        const [year, month] = dateFilter.split("-");
        const startOfMonth = new Date(year, month - 1, 1); 
        const endOfMonth = new Date(year, month, 0); 

        endOfMonth.setHours(23, 59, 59, 999);
        query = { createdAt: { $gte: startOfMonth, $lte: endOfMonth }};
        groupBy = { day: { $dayOfMonth: "$createdAt" }};
      }
      else if (/^\d{4}$/.test(dateFilter)) {
        const startOfYear = new Date(dateFilter, 0, 1); 
        const endOfYear = new Date(dateFilter, 11, 31); 
          console.log(startOfYear)
        endOfYear.setHours(23, 59, 59, 999);
        query = { createdAt: { $gte: startOfYear, $lte: endOfYear }};
        groupBy = { month: { $month: "$createdAt" }};
      }
    }
    const aggregateResult = await userInteractModel.aggregate([
      { $match: {
        ...query,
        device: "LED"
      } },
      {
        $project: {
          hour: { $hour: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          createdAt: 1,
          action: 1
        },
      },
      {
        $group: {
          _id: {
            hour: "$hour",
            day: "$day",
            month: "$month",
            year: "$year",
          },
          actions: { $push: "$action" }, // Collect actions into an array
          createdAt: { $first: "$createdAt" }, // First occurrence of createdAt
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } }, // Sort in chronological order
    ]);
    
    const formattedResult = aggregateResult.map((item) => {
      const { hour, day, month, year } = item._id;
      return {
        time: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:00`,
        actions: item.actions,
        createdAt: item.createdAt,
      };
    });
    
    // Return the result
    return formattedResult;
}
const updateLightDevice = async (status) => {
  try{  
    await deviceModel.findOneAndUpdate(
      { name: "LED" },
      { $set: { status: status } },
      { new: true, useFindAndModify: false }
    );
  } catch (error) {
    console.log(error);
  }
}


module.exports = { controlLight, getOutdoorInteract }