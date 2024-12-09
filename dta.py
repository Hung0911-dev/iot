import paho.mqtt.client as mqtt
import time

# MQTT credentials
username = "LjIgNhcvMS8fExc3NAQkGy8"
clientId = "LjIgNhcvMS8fExc3NAQkGy8"
password = "3bwr7bAwdtdtSjY6HMtcq/O2"
channel_id = "2750142"  # Replace with your ThingSpeak channel ID
write_api_key = "9JKCXB3XKR6WG7M5"  # Replace with your ThingSpeak write API key

# MQTT broker details for ThingSpeak
mqtt_host = "mqtt.thingspeak.com"
mqtt_port = 1883
publish_topic = f"channels/{channel_id}/publish/{write_api_key}"

# Callback function when the client connects to the broker
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected successfully to ThingSpeak MQTT broker")
    else:
        print(f"Failed to connect. Return code: {rc}")

# Initialize MQTT client and set callback
client = mqtt.Client(clientId)
client.username_pw_set(username, password)
client.on_connect = on_connect

# Connect to the MQTT broker
client.connect(mqtt_host, mqtt_port, 60)
client.loop_start()

# Send data loop (example: sending temperature data)
try:
    while True:
        temperature = 25.0  # Replace with sensor reading or other data
        payload = f"field1={temperature}"

        result = client.publish(publish_topic, payload)
        if result.rc == 0:
            print(f"Data sent successfully: {payload}")
        else:
            print("Failed to send data")

        time.sleep(15)  # Send data every 15 seconds (ThingSpeak free account limit)
except KeyboardInterrupt:
    print("Stopped by user")
finally:
    client.loop_stop()
    client.disconnect()
