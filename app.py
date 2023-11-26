from flask import Flask, render_template, Response
import time
from python import sensors_classes as sc
import json
import subprocess
import serial
import platform
from multiprocessing import Process
from python import read_serial # Import when there is a connection to the port
from python.read_serial import PressureSensor, IMUSensor


# Simulate pressure data
pressure_data = sc.PressureSensor()
pressure_data.time.append(1)
pressure_data.pressure.append(2)
pressure_data.temperature.append(3)
pressure_data.depth.append(4)

#Initialize serial port
# Constants depending on platform
if platform.system() == "Darwin":
    SERIAL_PORT = "/dev/cu.usbmodem1401"
else:
    SERIAL_PORT = "COM3"

BAUD_RATE = 115200

ser = serial.Serial(SERIAL_PORT, BAUD_RATE)
#ser = read_serial.initialize_arduino(read_serial.SERIAL_PORT, read_serial.BAUD_RATE)

#Initialize database
pressure_data = PressureSensor()
imu_data = IMUSensor()

#Initialize flask
app = Flask(__name__)

@app.route('/imu', methods=['POST'])
def start_IMU():
    print("Called exec")
    return
    # processing_executable = subprocess.Popen(["/mnt/c/Users/nicpi/ECE356/SeaNav/processing/cuberotate.exe"], stdout=subprocess.PIPE)

# Simulated sensor data (replace this with your actual sensor data logic)
def generate_sensor_data():
    while True:
        real_time_pressure_data = pressure_data.most_recent_data()
        # Generate or fetch sensor data here (replace this with your sensor logic)
        sensor_data = {
            "temperature":25.5,
            "humidity":50.0,
        }
        sensor_data.update(real_time_pressure_data)
        yield f"data: {json.dumps(sensor_data)}\n\n"
        time.sleep(1)  # Simulate data being sent every second
        
@app.route('/')
def index():
    return render_template('index.html')  # Replace with your HTML file

@app.route('/stream-sensor-data')
def stream_sensor_data():
    return Response(generate_sensor_data(), content_type='text/event-stream')

def polling_serial(ser: serial.Serial, pressure_data: PressureSensor,
                   imu_data: IMUSensor) -> None:
    while True:
        read_serial.read_serial_data(ser, pressure_data, imu_data)


if __name__ == '__main__':
    p = Process(target = polling_serial, args=(ser, pressure_data, imu_data))
    p.start()
    app.run(debug=False)  # Start the Flask app using the built-in development server
    p.join()
