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


module.exports = { controlLight }