from flask import Flask, render_template, Response
import time
import json
import subprocess
import serial
import platform
import random
from multiprocessing import Process
from python import read_serial # Import when there is a connection to the port
from python.sensors_classes import PressureSensor, IMUSensor, DistanceSensor


TEST = False

# Simulate pressure data

#Initialize serial port
# Constants depending on platform
if platform.system() == "Darwin":
    SERIAL_PORT = "/dev/cu.usbmodem1401"
    PROCESSING_PATH = ""
else:
    SERIAL_PORT = "COM3"

BAUD_RATE = 115200

#Initialize flask
app = Flask(__name__)

# @app.route('/imu', methods=['POST'])
# def start_IMU():
#     processing_executable = subprocess.Popen([PROCESSING_PATH], stdout=subprocess.PIPE)
#     data = {
#         "data" : True,
#     }
#     return data

# Simulated sensor data (replace this with your actual sensor data logic)
def generate_sensor_data():
    while True:
        
        read_serial.read_serial_data(ser, pressure_data, imu_data, distance_data)
        real_time_pressure_data = pressure_data.most_recent_data()
        real_time_imu_data = imu_data.most_recent_data()
        real_time_distance_data = distance_data.most_recent_data()
        # Generate or fetch sensor data here (replace this with your sensor logic)
        sensor_data = {}
        sensor_data.update(real_time_pressure_data)
        sensor_data.update(real_time_imu_data)
        sensor_data.update(real_time_distance_data)
        #print(sensor_data)
        yield f"data: {json.dumps(sensor_data)}\n\n"
        #time.sleep(1)  # Simulate data being sent every second
        
@app.route('/')
def index():
    return render_template('index.html')  # Replace with your HTML file

@app.route('/stream-sensor-data')
def stream_sensor_data():
    return Response(generate_sensor_data(), content_type='text/event-stream')


@app.route('/generate-matlab' , methods=['POST'])
def generate_matlab():
    data = {"data": True}
    # imu_data.write_to_matlab_file("/Users/echatham/Documents/MATLAB/imu_data.txt")
    matlab_script = '/Users/echatham/Documents/MATLAB/WitMotion.m'

    # Run MATLAB script using subprocess
    subprocess.run(['/Applications/MATLAB_R2023b.app/bin/matlab', '-batch', f"run('{matlab_script}')"])

    # Path to the generated MATLAB JPEG file
    # matlab_output_image = 'C:\\Users\echat\Documents\MATLAB\\try_now.jpg'
    return data




if __name__ == '__main__':
    # Open serial port
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE)

    # Build database objects to store data to
    pressure_data = PressureSensor()
    distance_data = DistanceSensor()
    imu_data = IMUSensor()

    # Start Flask server
    app.run(debug=False)