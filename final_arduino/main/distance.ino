/*
  Original source from https://forum.arduino.cc/t/pulsein-substitute-needed/287238
  adapted from to get the distance sensor
  Modified 
  =======
  2023/NOV/26 - Adapted to work with SeaNav project (NM)
*/

// Global variable for pulse time
volatile unsigned long LastPulseTime;

// Pin configurations for SPI communication
#define trigPin 7
#define echoPin 2

// ISR for determining the distance without pausing code.
void EchoPinISR() {
  static unsigned long startTime;

  if (digitalRead(2)) // Gone HIGH
    startTime = micros();
  else  // Gone LOW
  LastPulseTime = micros() - startTime;
}

void setup_distance() {
  // Setup pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Pin 2 interrupt on any change
  attachInterrupt(0, EchoPinISR, CHANGE);  
}

void loop_distance(){

  // Set trigger low for 5 microseconds
  digitalWrite(trigPin, LOW); 
  delayMicroseconds(5); 

  // Set trigger high for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10); 
  
  // Set trigger low
  digitalWrite(trigPin, LOW);

  // Calculate distance with lastpulsetime interrupt
  float distance = LastPulseTime/58.2;
  float time = micros()/ 1e6;

  // Format message, see format in Python read_serial.py file
  String pressure_data = String(time) + "," + "d" + "," + String(distance);

  // Send message over serial
  Serial.println(pressure_data);
}
