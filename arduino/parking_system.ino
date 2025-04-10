#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <RTClib.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// Pin definitions
#define SS_PIN 10
#define RST_PIN 9
#define GREEN_LED 7
#define RED_LED 6
#define BUZZER 5

// WiFi credentials
const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";

// API endpoint
const char* serverUrl = "http://your-nextjs-api.com/api/parking";

// Initialize objects
MFRC522 rfid(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);
RTC_DS3231 rtc;

// Global variables
String activeCard = "";
bool isParked = false;
unsigned long entryTime = 0;

void setup() {
  Serial.begin(9600);
  
  // Initialize RFID
  SPI.begin();
  rfid.PCD_Init();
  
  // Initialize LCD
  lcd.init();
  lcd.backlight();
  
  // Initialize RTC
  if (!rtc.begin()) {
    lcd.print("RTC Error");
    while (1);
  }
  
  // Initialize pins
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    lcd.print("Connecting...");
  }
  lcd.clear();
  lcd.print("System Ready");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }
  
  String cardId = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    cardId += String(rfid.uid.uidByte[i], HEX);
  }
  
  // Check card status and balance
  if (checkCardValidity(cardId)) {
    handleParking(cardId);
  }
  
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

bool checkCardValidity(String cardId) {
  HTTPClient http;
  http.begin(serverUrl + "/check/" + cardId);
  
  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    
    bool isValid = doc["isValid"];
    int balance = doc["balance"];
    
    if (!isValid || balance < 20) {
      displayError("Invalid/Low Bal");
      return false;
    }
    return true;
  }
  return false;
}

void handleParking(String cardId) {
  if (!isParked) {
    // Entry
    entryTime = rtc.now().unixtime();
    isParked = true;
    activeCard = cardId;
    
    digitalWrite(GREEN_LED, HIGH);
    tone(BUZZER, 1000, 500);
    
    lcd.clear();
    lcd.print("Welcome!");
    
    // Send entry data to server
    sendParkingData(cardId, "entry");
  } else if (cardId == activeCard) {
    // Exit
    unsigned long exitTime = rtc.now().unixtime();
    unsigned long duration = exitTime - entryTime;
    
    isParked = false;
    activeCard = "";
    
    digitalWrite(RED_LED, HIGH);
    tone(BUZZER, 2000, 500);
    
    lcd.clear();
    lcd.print("Goodbye!");
    
    // Send exit data to server
    sendParkingData(cardId, "exit", duration);
  }
  
  delay(2000);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
  lcd.clear();
  lcd.print("System Ready");
}

void sendParkingData(String cardId, String action, unsigned long duration = 0) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  DynamicJsonDocument doc(1024);
  doc["cardId"] = cardId;
  doc["action"] = action;
  doc["timestamp"] = rtc.now().unixtime();
  if (duration > 0) {
    doc["duration"] = duration;
  }
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  http.POST(jsonString);
  http.end();
}

void displayError(String message) {
  lcd.clear();
  lcd.print(message);
  digitalWrite(RED_LED, HIGH);
  tone(BUZZER, 3000, 1000);
  delay(2000);
  digitalWrite(RED_LED, LOW);
  lcd.clear();
  lcd.print("System Ready");
}