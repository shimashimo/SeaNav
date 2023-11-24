from flask import Flask, render_template, Response
import time

app = Flask(__name__)

# Simulated sensor data (replace this with your actual sensor data logic)
def generate_sensor_data():
    while True:
        # Generate or fetch sensor data here (replace this with your sensor logic)
        sensor_data = {
            'temperature': 25.5,
            'humidity': 50.0,
            # Add more sensor data as needed
        }
        yield f"data: {sensor_data}\n\n"
        time.sleep(1)  # Simulate data being sent every second

@app.route('/')
def index():
    return render_template('index.html')  # Replace with your HTML file

@app.route('/stream-sensor-data')
def stream_sensor_data():
    return Response(generate_sensor_data(), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)  # Start the Flask app using the built-in development server
