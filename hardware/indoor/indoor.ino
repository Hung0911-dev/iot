#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>

#define DHTPIN D5           // DHT22 data pin
#define DHTTYPE DHT11       // DHT 22 (AM2302)
#define MQ2_ANALOG A0       // MQ-2 analog pin
#define KY026_DIGITAL D4    // KY-026 digital pin
#define VIBRATION_PIN D6    // SW-1801P vibration sensor digital pin
#define BUZZER_PIN D7       // Buzzer
#define GAS_THRESHOLD 400 

// WiFi and MQTT credentials
const char* ssid = "Le Dinh Khoa";
const char* password = "0969250818";
const char* mqtt_server = "1836f558f34d4320967bb0f1afe9b517.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "Hung091103";
const char* mqtt_password = "Hung091103";

WiFiClientSecure espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);  // Initialize DHT sensor

bool isAlertActive = false; 
bool isBuzzerActive = true;

unsigned long previousMillis = 0;

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
  Serial.println("\nWiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientID = "ESPClient-";
    clientID += String(random(0xffff), HEX);
    if (client.connect(clientID.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("Iot_InDoor/client");
      client.subscribe("Iot_InDoor/control");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload, length);

  if (error) {
      Serial.print("JSON Deserialization failed: ");
      Serial.println(error.c_str());
      return;
  }

  const char* command = doc["command"];

  if (strcmp(command, "off") == 0) {
    digitalWrite(BUZZER_PIN, HIGH); // Turn off the buzzer
    isBuzzerActive = false;
    Serial.println("Buzzer turned off. Cooldown set.");
  } else if (strcmp(command, "on") == 0) {
    digitalWrite(BUZZER_PIN, LOW); // Turn off the buzzer
    isBuzzerActive = true;
    Serial.println("Buzzer turned off. Cooldown set.");
  }
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

void publishAlertNotification(const char* topic, const char* deviceName, const char* sensorType, const char* message) {
  StaticJsonDocument<256> doc;
  doc["deviceName"] = deviceName;
  doc["sensorType"] = sensorType;
  doc["message"] = message;

  char buffer[256];
  size_t n = serializeJson(doc, buffer);

  if (client.publish(topic, buffer, n)) {
    Serial.println("Alert notification published: ");
    Serial.println(buffer);
  } else {
    Serial.println("Failed to publish alert notification");
  }
}


// Consolidated data publishing function
void publishAllData() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int gasValue = analogRead(MQ2_ANALOG);        // Read MQ-2 gas sensor value
  int flameDetected = digitalRead(KY026_DIGITAL);  // Read KY-026 flame sensor (0 = flame detected)
  int vibrationDetected = digitalRead(VIBRATION_PIN);  // Read SW-1801P sensor
  
  // Check for sensor errors
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

 // Publish each sensor data separately
  publishSensorData("Iot_InDoor/temperature", "DHT-22", "temperature", t);
  publishSensorData("Iot_InDoor/humidity", "DHT-22", "humidity", h);
  publishSensorData("Iot_InDoor/gas", "MQ-2", "gas", gasValue);
  publishSensorData("Iot_InDoor/flame", "KY-026", "flame", (flameDetected == LOW) ? 1 : 0);
  publishSensorData("Iot_InDoor/vibration", "SW1801-P", "vibration", (vibrationDetected == LOW) ? 1 : 0);

  isAlertActive = false;

  Serial.println(isBuzzerActive);

  if(isBuzzerActive){
    if (gasValue > GAS_THRESHOLD) {
      isAlertActive = true;
      Serial.println("ALERT: Gas level exceeded threshold!");
      publishAlertNotification("Iot_InDoor/alert", "MQ-2", "gas","Gas level exceeded safe threshold");
    } 
    
    if (flameDetected == LOW) {
      isAlertActive = true;
      Serial.println("ALERT: Flame detected!");
      publishAlertNotification("Iot_InDoor/alert", "KY-026", "flame","Flame detected in the vicinity");
    } 
    
    if (vibrationDetected == LOW) {
      isAlertActive = true;
      Serial.println("ALERT: Vibration detected!");
      publishAlertNotification("Iot_InDoor/alert", "SW1801-P", "vibration","Vibration detected");
    }
  } else {
    Serial.println("ALERT: deactived!");
    isAlertActive = false;
    digitalWrite(BUZZER_PIN, HIGH);
    if (gasValue > GAS_THRESHOLD) {
      Serial.println("ALERT: Gas level exceeded threshold!");
      // publishAlertNotification("Iot_InDoor/alert", "MQ-2", "gas","Gas level exceeded safe threshold");
    } 
    
    if (flameDetected == LOW) {
      Serial.println("ALERT: Flame detected!");
      // publishAlertNotification("Iot_InDoor/alert", "KY-026", "flame","Flame detected in the vicinity");
    } 
    
    if (vibrationDetected == LOW) {
      Serial.println("ALERT: Vibration detected!");
      // publishAlertNotification("Iot_InDoor/alert", "SW1801-P", "vibration","Vibration detected");
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(KY026_DIGITAL, INPUT); // Initialize KY-026 flame sensor pin as input
  pinMode(VIBRATION_PIN, INPUT); // Initialize SW-1801P vibration sensor pin as input
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, HIGH);

  dht.begin();
  setup_wifi();
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long currentMillis = millis();
  int analogVal = analogRead(A0);

  // Publish all data periodically
  if (currentMillis - previousMillis >= 5000) {  // Every 5 seconds
    previousMillis = currentMillis;

    publishAllData();

    if(isAlertActive){
      digitalWrite(BUZZER_PIN, LOW);
    } else {
      digitalWrite(BUZZER_PIN, HIGH);
    }

  }
}
