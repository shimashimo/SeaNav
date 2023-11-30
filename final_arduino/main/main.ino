#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>
#include <Adafruit_LPS35HW.h>

void setup(){
  // Wait for serial connection to be established
  Serial.begin(115200);
  while (!Serial) { delay(1); }

  // Setup all hardware devices
  // I2C
  setup_imu();
  // setup_pressure();
  
  // SPI
  setup_distance();
}

void loop(){
  // Collect all sensor data
  loop_imu();
  // loop_pressure();
  loop_distance();

  // Add a 100 ms delay
  delay(100);
}

