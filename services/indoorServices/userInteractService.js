const userInteractModel = require("../../models/userInteractModel")
const { findDeviceByNameAndSensor } = require("../deviceService");
const deviceModel = require("../../models/deviceModel")

const mqtt = require('mqtt');
const mqttBrokerUrl = 'mqtts://1836f558f34d4320967bb0f1afe9b517.s1.eu.hivemq.cloud:8883';
const mqttOptions = {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  clean: true,
  connectTimeout: 4000,
  username: 'Hung091103', 
  password: 'Hung091103', 
};

const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

const controlBuzzer = async(userId, command) => {
    const controlTopic = 'Iot_InDoor/control';

    const payload = JSON.stringify({
        command: command,
    });

    mqttClient.publish(controlTopic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error('Failed to publish MQTT message:', err);
      }

      saveUserInteract("Buzzer", `Buzzer turn-${command}`, userId);
      if(command === "on"){
        updateBuzzerDevice(true);
      } else {
        updateBuzzerDevice(false);
      }
      console.log(`Buzzer turn-${command} command sent:`, payload);

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

const updateBuzzerDevice = async(status) => {
  try{  
    await deviceModel.findOneAndUpdate(
      { name: "Buzzer" },
      { $set: { status: status } },
      { new: true, useFindAndModify: false }
    );

  } catch (error) {
    console.log(error);
  }
}

module.exports = { controlBuzzer }