"""
Flask server that houses SeaNav dashboard. Communicates with serial port for data
collection from Arduino, and displays location, depth, 3-D model, distance, various graphs,
and radar.
"""
# Installed modules
import json
import subprocess
import platform
import serial
from flask import Flask, render_template, Response

# Local modules
from python.data_parsing import read_serial
from python.data_parsing.sensors_classes import PressureSensor, IMUSensor, DistanceSensor

#Initialize serial port
# Constants depending on platform to account for Windows and MacOS
if platform.system() == "Darwin":
    SERIAL_PORT = "/dev/cu.usbmodem1401"
    PROCESSING_PATH = ""
else:
    SERIAL_PORT = "COM3"

BAUD_RATE = 115200


# Constants for Matlab
MATLAB_PATH = '/Applications/MATLAB_R2023b.app/bin/matlab'

#Initialize flask
app = Flask(__name__)

# Simulated sensor data (replace this with your actual sensor data logic)
def generate_sensor_data() -> str:
    """
    Pull most recent sensor data from Arduino, store it in Python, and
    return the most recent data as a str in json format for front-end.

    Returns:
        str: String with most recent data in json format.
    """
    while True:
        # Read serial data from the serial port and save to Python as it comes in
        read_serial.read_serial_data(ser, pressure_data, imu_data, distance_data)

        # Get the most recent data
        real_time_pressure_data = pressure_data.most_recent_data()
        real_time_imu_data = imu_data.most_recent_data()
        real_time_distance_data = distance_data.most_recent_data()

        # Merge all three dictionaries
        sensor_data = real_time_pressure_data | real_time_imu_data | real_time_distance_data

        # Send the data to the webserver
        yield f"data: {json.dumps(sensor_data)}\n\n"

@app.route('/')
def index():
    """Renders the template found in templates/index.html for SeaNav dashboard

    Returns:
        str: String containing the html template for flask to render on the front-end.
    """
    return render_template('index.html')

@app.route('/stream-sensor-data')
def stream_sensor_data():
    """Stream sensor data from Arduino to front-end

    Returns:
        Response: Response that contains the most recent data in a json format.
    """
    return Response(generate_sensor_data(), content_type='text/event-stream')


@app.route('/generate-matlab' , methods=['POST'])
def generate_matlab():
    """Generate matlab IMU tracking image with data from Python.

    Returns:
        dict[str, bool]: Dictionary containing the response to running the matlab script.
    """

    # Return for function to send to flask server
    data = {"data": True}

    # Write data from imu to matlab file
    imu_data.write_to_matlab_file("/Users/echatham/Documents/MATLAB/imu_data.txt")
    matlab_script = '/Users/echatham/Documents/MATLAB/WitMotion.m'

    # Run MATLAB script using subprocess
    subprocess.run([MATLAB_PATH, '-batch', f"run('{matlab_script}')"], check=False)

    # Return to indicate matlab succesfully executed
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
