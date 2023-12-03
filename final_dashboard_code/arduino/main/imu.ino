/* This driver uses the Adafruit unified sensor library (Adafruit_Sensor),
   which provides a common 'type' for sensor data and some helper functions.

   To use this driver you will also need to download the Adafruit_Sensor
   library and include it in your libraries folder.

   You should also assign a unique ID to this sensor for use with
   the Adafruit Sensor API so that you can identify this particular
   sensor in any data logs, etc.  To assign a unique ID, simply
   provide an appropriate value in the constructor below (12345
   is used by default in this example).

   Connections
   ===========
   Connect SCL to SCL
   Connect SDA to SDA
   Connect VDD to 5V DC
   Connect GROUND to GND

   History
   =======
   2015/MAR/03  - First release (KTOWN)
   
   Modified 
   =======
   2023/NOV/26 - Adapted to work with SeaNav project (NM)
*/

// Check I2C device address and correct line below (by default address is 0x29 or 0x28)
//                                   id, address
Adafruit_BNO055 bno = Adafruit_BNO055(55, 0x28, &Wire);

// Variables to store data from IMU sensor to be sent to serial.
String name = "";
String str_x = "";
String str_y = "";
String str_z = "";
String data_to_send = "";


void setup_imu(void)
{
  /* Initialise the sensor */
  if (!bno.begin())
  {
    /* There was a problem detecting the BNO055 ... check your connections */
    Serial.print("Ooops, no BNO055 detected ... Check your wiring or I2C ADDR!");
    while (1);
  }
}

void loop_imu(void)
{
  // Sensor objects to store different types of data in 
  sensors_event_t orientationData , angVelocityData , linearAccelData, magnetometerData, accelerometerData, gravityData;

  // Tie each sensor event to the corresponding data
  bno.getEvent(&orientationData, Adafruit_BNO055::VECTOR_EULER);
  bno.getEvent(&angVelocityData, Adafruit_BNO055::VECTOR_GYROSCOPE);
  bno.getEvent(&linearAccelData, Adafruit_BNO055::VECTOR_LINEARACCEL);
  bno.getEvent(&magnetometerData, Adafruit_BNO055::VECTOR_MAGNETOMETER);
  bno.getEvent(&accelerometerData, Adafruit_BNO055::VECTOR_ACCELEROMETER);
  bno.getEvent(&gravityData, Adafruit_BNO055::VECTOR_GRAVITY);

  // Print sensor data over serial to the corresponding event
  printEvent(&orientationData);
  printEvent(&angVelocityData);
  printEvent(&linearAccelData);
  printEvent(&magnetometerData);
  printEvent(&accelerometerData);
  printEvent(&gravityData);

  // Print heading, pitch, and roll over serial
  quat_imu();

  // name, system, gyro, accel, mag
  uint8_t system, gyro, accel, mag = 0;
  bno.getCalibration(&system, &gyro, &accel, &mag);

  // Get board temperature for message
  int8_t boardTemp = bno.getTemp();

  // Get current time for data timestamp
  float time = micros()/ 1e6;

  // Format message, see format in Python read_serial.py file
  data_to_send = String(time) + "," + String("i") + "," + String("cal") + "," + String(system) + "," + String(gyro) + "," + String(accel) + "," + String(mag) + "," + String(boardTemp);

  // Send data over serial
  Serial.println(data_to_send);
}

void printEvent(sensors_event_t* event) {
  double x = -1000000, y = -1000000 , z = -1000000; //dumb values, easy to spot problem
  if (event->type == SENSOR_TYPE_ACCELEROMETER) {
    // Tag the name for the message
    name = "acc";

    // Store the data in a variable to put into message
    x = event->acceleration.x;
    y = event->acceleration.y;
    z = event->acceleration.z;
  }
  else if (event->type == SENSOR_TYPE_ORIENTATION) {
    name = "ori";
    x = event->orientation.x;
    y = event->orientation.y;
    z = event->orientation.z;
  }
  else if (event->type == SENSOR_TYPE_MAGNETIC_FIELD) {
    name = "mag";
    x = event->magnetic.x;
    y = event->magnetic.y;
    z = event->magnetic.z;
  }
  else if (event->type == SENSOR_TYPE_GYROSCOPE) {
    name = "ang";
    x = event->gyro.x;
    y = event->gyro.y;
    z = event->gyro.z;
  }
  else if (event->type == SENSOR_TYPE_ROTATION_VECTOR) {
    name = "rot";
    x = event->gyro.x;
    y = event->gyro.y;
    z = event->gyro.z;
  }
  else if (event->type == SENSOR_TYPE_LINEAR_ACCELERATION) {
    name = "lin";
    x = event->acceleration.x;
    y = event->acceleration.y;
    z = event->acceleration.z;
  }
  else if (event->type == SENSOR_TYPE_GRAVITY) {
    name = "gra";
    x = event->acceleration.x;
    y = event->acceleration.y;
    z = event->acceleration.z;
  }
  else { 
    // Send over unknown data
    name = "unk";
  }

  // Convert doubles to strings with two decimal places  
  str_x = String(x);
  str_y = String(y);
  str_z = String(z);

  // Timestamp data
  float time = micros()/ 1e6;

  // Format message, see format in Python read_serial.py file
  data_to_send = String(time) + "," + String("i") + "," + name + "," + str_x + "," + str_y + "," + str_z;

  // Print message
  Serial.println(data_to_send);
}

void quat_imu(){
  // Thanks to gammaburst @ forums.adafruit.com for this conversion.
  imu::Quaternion q = bno.getQuat();

  // flip BNO/Adafruit quaternion axes to aerospace: x forward, y right, z down
  // float temp = q.x();  q.x() = q.y();  q.y() = temp;  q.z() = -q.z();
  q.normalize();

  // convert aerospace quaternion to aerospace Euler, because BNO055 Euler data is broken
  float heading = 180/M_PI * atan2(q.x()*q.y() + q.w()*q.z(), 0.5 - q.y()*q.y() - q.z()*q.z());
  float pitch   = 180/M_PI * asin(-2.0 * (q.x()*q.z() - q.w()*q.y()));
  float roll    = 180/M_PI * atan2(q.w()*q.x() + q.y()*q.z(), 0.5 - q.x()*q.x() - q.y()*q.y());
  heading = heading < 0 ? heading+360 : heading;

  // Timestamp data
  float time = micros()/ 1e6;

  // Format message, see format in Python read_serial.py file
  String quat_data = String(time) + "," + "i" + ",qua," + String(heading) 
                         + "," + String(pitch) + "," + String(roll);

  // Print message
  Serial.println(quat_data);

}