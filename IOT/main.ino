#include <WiFi.h>
#include <FirebaseESP32.h>
#include "DHT.h"

#define WIFI_SSID "WiFi"
#define WIFI_PASSWORD "Password"
#define API_KEY "FIREBASE_API_KEY"
#define DATABASE_URL " " 

#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nConnected!");

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  dht.begin();
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int gas = analogRead(34);       // gas sensor analog pin
  int battery = analogRead(35);   // battery voltage pin

  if (isnan(temp) || isnan(hum)) {
    Serial.println("Sensor read error");
    return;
  }

  String path = "/raw_readings/";
  path += String(millis());

  FirebaseJson json;
  json.add("temperature", temp);
  json.add("humidity", hum);
  json.add("gas", gas);
  json.add("battery", battery);
  json.add("timestamp", millis());

  if (Firebase.RTDB.setJSON(&fbdo, path.c_str(), &json)) {
    Serial.println(" Data sent to Firebase");
  } else {
    Serial.println("Send failed: " + fbdo.errorReason());
  }

  delay(15000); // every 15 seconds
}
