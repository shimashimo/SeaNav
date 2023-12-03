# ECE 356 SeaNav - Underwater Navigation System

SeaNav is a modular navigation system that is applied to existing drone systems with sensor fusion to provide navigation characteristics including GPS location, depth, inertial measurement unit (IMU) properties, and surrounding object detection. This information is wrapped up in an interactable user-friendly dashboard with various options for data analysis methods and a 3-D model.

# Software
SeaNav consists of three main software components, an Arduino UNO Microcontroller in Arduion's version of C++, a Flask server in Python, and IMU tracking in Matlab. The files under final_dashboard_code/arduino are for the Arduino Microcontroller, the script under final_dashboard_code/python/app.py runs the flask server, and the files under final_dashboard_code/matlab contains the Matlab code for IMU position tracking.

# Documentation
See sphinx_documentation/html for generated documentation for the Python software.

# Arduino Libraries
Pressure Sensor: Adafruit LPS35HW by Adafruit \
IMU Sensor: Adafruit BNO055 by Adafruit 

# Tutorials
Pressure Sensor (LPS35HW): https://cdn-learn.adafruit.com/downloads/pdf/lps35hw-water-resistant-pressure-sensor.pdf \
IMU Sensor (BNO055): https://cdn-learn.adafruit.com/downloads/pdf/adafruit-bno055-absolute-orientation-sensor.pdf 

# Datasheets
Pressure Sensor (LPS35HW): https://www.st.com/resource/en/datasheet/lps35hw.pdf \
IMU Sensor (BNO055): https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bno055-ds000.pdf 