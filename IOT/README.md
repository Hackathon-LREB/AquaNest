# 🐟 AquaNest IoT Module — Smart Cold Chain Monitoring

The **AquaNest IoT system** monitors and maintains optimal conditions for fish preservation in cold chain boxes.  
It uses an **ESP32 microcontroller** connected to sensors for real-time environmental data, including **temperature, dissolved oxygen**, and also controls a **cooling motor, LED, and buzzer**. Data is uploaded to a **backend server** for analysis and further AI-based monitoring.

---

## ⚙️ Features

- 🌡️ **Temperature Monitoring:** Using DS18B20 to detect real-time water temperature.  
- 💧 **Oxygen Level Monitoring:** Analog sensor measures oxygen concentration in the cold box.  
- 💡 **Cooling Motor & LED Control:** Automatically turns on/off based on temperature thresholds.  
- 🔔 **Buzzer Alerts:** Activates if cooling is engaged to notify users.  
- ☁️ **Cloud Integration:** Sends sensor readings via HTTP POST to backend API (`/api/v1/iot/data`).  
- 🧠 **AI & Smart Alerts (via Backend):** Backend may send commands like `TURN_ON_COOLER` or `TURN_OFF_COOLER` to optimize storage conditions.  

---

## 🧩 Hardware Components

| Component | Function |
|-----------|---------|
| **ESP32** | Main controller for Wi-Fi, sensor reading, and motor/LED/buzzer control |
| **DS18B20** | Measures water temperature |
| **Dissolved Oxygen Sensor** | Reads oxygen levels in the fish tank |
| **Motor** | Cooling motor to maintain temperature |
| **LED** | Visual indicator for cooling status |
| **Buzzer** | Audio alert for motor activation |
| **Wi-Fi Module** | Transmits data to backend server |

---

## 🪛 Wiring Overview

| ESP32 Pin | Component | Description |
|-----------|-----------|-------------|
| D4        | DS18B20 Data | Temperature sensor |
| D32       | Oxygen Sensor | Analog read for oxygen |
| D25       | Motor | Cooling motor control |
| D27       | LED | Cooling indicator |
| D14       | Buzzer | Alert for motor activation |
| 3V3 / GND | Power | Supplies 3.3V and ground |

---

## 🔧 Setup Instructions

1. **Clone or copy the code** to your Arduino IDE.  

2. **Install Required Libraries:**
   - [OneWire](https://www.arduino.cc/reference/en/libraries/onewire/)  
   - [DallasTemperature](https://github.com/milesburton/Arduino-Temperature-Control-Library)  
   - [ArduinoJson](https://arduinojson.org/)  
   - [HTTPClient](https://www.arduino.cc/en/Reference/HTTPClient)  

3. **Update Wi-Fi & Backend Settings** in the code:

   ```cpp
   const char* ssid = "Your_WiFi_Name";
   const char* password = "Your_WiFi_Password";
   const char* serverURL = "https://your-backend.com/api/v1/iot/data";
