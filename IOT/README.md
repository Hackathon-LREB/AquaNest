# 🐟 AquaNest IoT Module — Smart Cold Chain Monitoring
The **AquaNest IoT system** is designed to monitor and maintain optimal conditions for fish preservation within the cold chain network.  
It uses an **ESP32 microcontroller** connected to various sensors to collect real-time environmental data such as temperature, humidity, gas levels, and battery status, then uploads this data to **Firebase** for analysis and visualization.

---
## ⚙️ Features
- 🌡️ **Temperature Monitoring:** Using the DHT11 sensor to detect real-time temperature.
- 💧 **Humidity Tracking:** Ensures proper moisture levels within the cold box.
- 🧪 **Gas Detection:** Reads gas sensor data (e.g., ammonia, CO₂) to detect spoilage or contamination.
- 🔋 **Battery Level Monitoring:** Monitors power levels for efficient energy management.
- ☁️ **Cloud Integration:** Sends all sensor readings to Firebase Realtime Database for logging and AI analysis.
- 🧠 **AI Integration (via Cloud):** Data is later processed by the Samaki Link AI engine to detect faults and optimize performance.

---

## 🧩 Hardware Components

| Component | Function |
|------------|-----------|
| **ESP32** | Main controller for Wi-Fi and data processing |
| **DHT11** | Measures temperature and humidity |
| **MQ Gas Sensor** | Detects gas concentration levels |
| **Battery Sensor (Analog Pin 35)** | Measures battery voltage |
| **Wi-Fi Module** | Transmits data to Firebase cloud |

---

## 🪛 Wiring Overview

| ESP32 Pin | Component | Description |
|------------|------------|-------------|
| D4 | DHT11 Data | Temperature & humidity sensor |
| A34 | MQ Gas Sensor | Reads gas level analog data |
| A35 | Battery Sensor | Reads battery voltage level |
| 3V3 / GND | Power | Supplies 3.3V and ground |

---

## 🔧 Setup Instructions

1. **Clone or copy this code** to your Arduino IDE.
2. **Install Required Libraries:**
   - [FirebaseESP32](https://github.com/mobizt/Firebase-ESP32)
   - [DHT Sensor Library](https://github.com/adafruit/DHT-sensor-library)
   - [Adafruit Unified Sensor](https://github.com/adafruit/Adafruit_Sensor)

3. **Update credentials in the code:**
   ```cpp
   #define WIFI_SSID "Your_WiFi_Name"
   #define WIFI_PASSWORD "Your_WiFi_Password"
   #define API_KEY "Your_Firebase_API_Key"
   #define DATABASE_URL "https://your-database.firebaseio.com/"
