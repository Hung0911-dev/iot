#include <DHT.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define DHTPIN 14
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

int motion_sensor_pin = 13;
int air_quality_pin = 34;
int led_pin_pir = 2;
int led_pin_control = 15;

const char* ssid = "Le Dinh Khoa"; 
const char* password = "0969250818"; 
const char* mqtt_server = "eb95b651127d4e39afc7f2150b88a296.s1.eu.hivemq.cloud"; 
const int mqtt_port = 8883;  
const char* mqtt_user = "Hung091103"; 
const char* mqtt_pass = "Hung091103"; 
const char* mqtt_topic = "Iot_OutDoor";
const char* device_control_topic = "Iot_OutDoor/Led_Control";

WiFiClientSecure esp_client;
PubSubClient client(esp_client);

float last_temperature = 0.0;
float last_humidity = 0.0;
int last_motion_state = -1;
int last_air_quality = -1;

unsigned long led_on_time = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqtt_user, mqtt_pass)) {
      Serial.println("connected");
      client.subscribe(device_control_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void control_led(const char* msg) {
Serial.print("Received message: ");
  Serial.println(msg);  // Debug: Print the received message
  
  if (strncmp(msg, "ON",2) == 0) {
    digitalWrite(led_pin_control, HIGH);
    Serial.println("LED15 turned ON");
  } else if (strncmp(msg, "OFF",3) == 0) {
    digitalWrite(led_pin_control, LOW);
    Serial.println("LED15 turned OFF");
  } else {
    Serial.println("Unknown command received.");
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0';
  String message = String((char*)payload);
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  Serial.println(message);

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload, length);

  if (error) {
      Serial.print("JSON Deserialization failed: ");
      Serial.println(error.c_str());
      return;
  }

  const char* command = doc["command"];

  if (strcmp(command, "ON") == 0) {
    digitalWrite(led_pin_control, HIGH);
    Serial.println("LED15 turned ON");
  } else if (strcmp(command, "OFF") == 0) {
    digitalWrite(led_pin_control, LOW);
    Serial.println("LED15 turned OFF");
  } else {
    Serial.println("Unknown command received.");
  }
}

void setup() {
  Serial.begin(115200);
  esp_client.setInsecure();  
  pinMode(motion_sensor_pin, INPUT);
  pinMode(led_pin_control, OUTPUT);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  dht.begin();
}

void publishSensorData(const char* topic, const char* deviceName, const char* sensorType, float value) {
  StaticJsonDocument<256> doc;
  doc["deviceName"] = deviceName;
  doc["sensorType"] = sensorType;
  doc["value"] = value;

  char buffer[256];
  size_t n = serializeJson(doc, buffer);

  if(client.publish(topic, buffer, n)){
    Serial.println("Data published: ");
    Serial.println(buffer);
  } else {
    Serial.println("Failed to publish data");
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int motion_state = digitalRead(motion_sensor_pin);
  if (motion_state == HIGH) {
    digitalWrite(motion_sensor_pin, HIGH);
    digitalWrite(led_pin_control, HIGH);
    led_on_time = millis();
    Serial.println("Motion detected!");
  } else {
    digitalWrite(motion_sensor_pin, LOW);
    digitalWrite(led_pin_control, LOW);
  }

  // if (millis() - led_on_time >= 6000) {
  //   digitalWrite(motion_sensor_pin, LOW);
  // }

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int air_quality = analogRead(air_quality_pin);
  
  bool data_changed = false;
  
  if (motion_state != last_motion_state) {
    data_changed = true;
    last_motion_state = motion_state;
  }
  
  if (humidity != last_humidity) {
    data_changed = true;
    last_humidity = humidity;
  }

  if (temperature != last_temperature) {
    data_changed = true;
    last_temperature = temperature;
  }

  if (air_quality != last_air_quality) {
    data_changed = true;
    last_air_quality = air_quality;
  }

  if (data_changed) {
    publishSensorData("Iot_OutDoor/temperature", "DHT-11", "temperature", temperature);
    publishSensorData("Iot_OutDoor/humidity", "DHT-11", "humidity", humidity);
    publishSensorData("Iot_OutDoor/air", "MQ-135", "air", air_quality);
    publishSensorData("Iot_OutDoor/motion", "SR-505", "motion", (motion_state == HIGH) ? 1 : 0);
  }

  delay(1000);
}