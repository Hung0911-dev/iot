const brokerUrl = 'mqtts://877ab903f4a0407aa62686c3d962bb59.s1.eu.hivemq.cloud:8883';
 
const options = {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`, 
  clean: true, 
  connectTimeout: 4000,
  username: 'Hung091103', 
  password: 'Hung091103', 
};
 
const client = mqtt.connect(brokerUrl, options);
 
client.on('connect', () => {
  console.log('Connected to HiveMQ Cloud.');
 
  const topic = 'Iot_InDoor';
  client.subscribe(topic, { qos: 1 }, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error('Subscription error:', err);
    }
  });
});
 
client.on('message', (topic, message) => {
  console.log(`Received message from topic "${topic}":`);
  console.log(JSON.parse(message.toString()));
});
 
client.on('error', (err) => {
  console.error('Connection error:', err);
});
 
client.on('close', () => {
  console.log('Disconnected from HiveMQ Cloud.');
});