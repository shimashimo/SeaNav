/*
  Original source from https://learn.adafruit.com/lps35hw-water-resistant-pressure-sensor/arduino
  adapted from to get the pressure sensor.
  Modified 
  =======
  2023/NOV/26 - Adapted to work with SeaNav project (NM)
*/


Adafruit_LPS35HW lps35hw = Adafruit_LPS35HW();

// For SPI mode, we need a CS pin
#define LPS_CS  10
// For software-SPI mode we need SCK/MOSI/MISO pins
#define LPS_SCK  13
#define LPS_MISO 12
#define LPS_MOSI 11

void setup_pressure(){
  // Ensure I2C connection is established
  if (!lps35hw.begin_I2C()) {
    Serial.println("No Pressure Sensor");
    while (1);
  }
  lps35hw.zeroPressure();  //equates the pressure reading with 0 every time program starts
}

void loop_pressure(){
  // Strings to hold temperature and pressure data from sensor
  String temp = String(lps35hw.readTemperature());
  String pressure = String(lps35hw.readPressure());

  // Depending on use case to get depth. d = pgh is used for calculations, see report for further details.
  // float  depth = lps35hw.readPressure() / 1.0038; //  use for saltwater
  float depth = lps35hw.readPressure() / 0.9778; // use for freshwater
  // float depth = lps35hw.readPressure() * 100 / (9778.07);  // hectoPascals * 100 kg/ms^2 / kg/(m^2*s^2) 

  float time = micros()/ 1e6;
  
  // Format message, see format in Python read_serial.py file
  String pressure_data = String(time) + "," + "p" + "," + String(temp) + "," + pressure + "," + String(depth);

  // Print data over serial.
  Serial.println(pressure_data);

}
