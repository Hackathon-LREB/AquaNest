#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <esp_wifi.h>  // For ESP32 WiFi stability

// -------- WiFi Settings --------
const char* ssid = "NunuaYako";
const char* password = "12345678";
const char* serverURL = "https://aquafish.onrender.com/api/v1/iot/data";

// -------- Pins --------
#define MOTOR_PIN 25
#define LED_PIN 27
#define BUZZER_PIN 14
#define DS18B20_PIN 4
#define OXYGEN_PIN 32

// -------- Globals --------
OneWire oneWire(DS18B20_PIN);
DallasTemperature sensors(&oneWire);

unsigned long lastTelemetry = 0;
unsigned long telemetryInterval = 10000; // 10 seconds

// Cooling box coordinates
const float latitude = 1.234567;
const float longitude = 36.789012;

// Temperature thresholds for motor & LED
const float TEMP_THRESHOLD_ON = 28.0;
const float TEMP_THRESHOLD_OFF = 26.0;
bool motorAndLedOn = false;

// -------- Helper Functions --------
void sendTelemetryHTTP(float temp, float oxygen) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, cannot send telemetry");
    return;
  }

  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<400> jsonDoc;
  jsonDoc["id"] = "p369JTqz7ZTse4hLNWSl"; // Cage ID
  jsonDoc["temp"] = temp;
  jsonDoc["oxygen"] = oxygen;
  jsonDoc["nitrogen"] = 0;   // dummy for backend
  jsonDoc["phosphorus"] = 0; // dummy for backend

  JsonObject loc = jsonDoc.createNestedObject("location");
  loc["latitude"] = latitude;
  loc["longitude"] = longitude;

  String requestBody;
  serializeJson(jsonDoc, requestBody);

  int httpResponseCode = http.POST(requestBody);
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Backend Response: " + response);

    // Parse backend commands
    StaticJsonDocument<200> respDoc;
    if (deserializeJson(respDoc, response) == DeserializationError::Ok) {
      if (respDoc.containsKey("command")) {
        String cmd = respDoc["command"];
        Serial.println("Command from backend: " + cmd);

        if (cmd == "TURN_ON_COOLER") {
          digitalWrite(MOTOR_PIN, HIGH);
          digitalWrite(LED_PIN, HIGH);
          motorAndLedOn = true;
          digitalWrite(BUZZER_PIN, HIGH);
        } else if (cmd == "TURN_OFF_COOLER") {
          digitalWrite(MOTOR_PIN, LOW);
          digitalWrite(LED_PIN, LOW);
          motorAndLedOn = false;
          digitalWrite(BUZZER_PIN, LOW);
        }
      }
    }

  } else {
    Serial.printf("HTTP POST error: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

// -------- Setup --------
void setup() {
  Serial.begin(115200);

  // Pin setup
  pinMode(MOTOR_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  sensors.begin();

  digitalWrite(MOTOR_PIN, LOW);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  motorAndLedOn = false;

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
}

// -------- Main Loop --------
void loop() {
  // Read sensors
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);
  float oxygen = analogRead(OXYGEN_PIN) * (10.0 / 4095.0);

  Serial.printf("Temp: %.2f C, Oxygen: %.2f\n", temp, oxygen);

  // Local motor, LED & buzzer control with hysteresis
  if (!motorAndLedOn && temp > TEMP_THRESHOLD_ON) {
    digitalWrite(MOTOR_PIN, HIGH);
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(BUZZER_PIN, HIGH);
    motorAndLedOn = true;
    Serial.println("Motor, LED, and buzzer ON (temp above threshold)");
  } else if (motorAndLedOn && temp < TEMP_THRESHOLD_OFF) {
    digitalWrite(MOTOR_PIN, LOW);
    digitalWrite(LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    motorAndLedOn = false;
    Serial.println("Motor, LED, and buzzer OFF (temp below threshold)");
  }

  // Send telemetry every interval
  if (millis() - lastTelemetry >= telemetryInterval) {
    sendTelemetryHTTP(temp, oxygen);
    lastTelemetry = millis();
  }

  delay(200); // small loop delay
}
