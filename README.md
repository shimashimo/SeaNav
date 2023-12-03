# ECE 356 SeaNav - Underwater Navigation System

SeaNav is a modular navigation system that is applied to existing drone systems with sensor fusion to provide navigation characteristics including GPS location, depth, inertial measurement unit (IMU) properties, and surrounding object detection. This information is wrapped up in an interactable user-friendly dashboard with various options for data analysis methods and a 3-D model.

# Software
SeaNav consists of two main software components, an Arduino UNO Microcontroller and a Flask server. The main folder in final_dashboard_code contains the files for the Arduino Microcontroller and app.py contains the flask server to run.

# Arduino Libraries
Pressure Sensor: Adafruit LPS35HW by Adafruit \
IMU Sensor: Adafruit BNO055 by Adafruit 

# Tutorials
Pressure Sensor (LPS35HW): https://cdn-learn.adafruit.com/downloads/pdf/lps35hw-water-resistant-pressure-sensor.pdf \
IMU Sensor (BNO055): https://cdn-learn.adafruit.com/downloads/pdf/adafruit-bno055-absolute-orientation-sensor.pdf 

# Datasheets
Pressure Sensor (LPS35HW): https://www.st.com/resource/en/datasheet/lps35hw.pdf \
IMU Sensor (BNO055): https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bno055-ds000.pdf 