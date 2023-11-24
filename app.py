from flask import Flask, render_template, Response
import time
from python import sensors_classes as sc
import json
import subprocess
#from python import read_serial # Import when there is a connection to the port

# Simulate pressure data
pressure_data = sc.PressureSensor()
pressure_data.time.append(1)
pressure_data.pressure.append(2)
pressure_data.temperature.append(3)
pressure_data.depth.append(4)

# Simulate imu data


app = Flask(__name__)

def start_IMU():
    processing_executable = subprocess.Popen(["path_to_exe"], stdout=subprocess.PIPE)


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

if __name__ == '__main__':
    app.run(debug=True)  # Start the Flask app using the built-in development server
