from flask import Flask, render_template, Response
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import serial
import csv
import io

app = Flask(__name)

# Constants
SERIAL_PORT = "/dev/cu.usbmodem1401"
BAUD_RATE = 115200

# Initialize serial connection
ser = serial.Serial(SERIAL_PORT, BAUD_RATE)

# Initialize empty lists to store data
x_vals = []
sensorValue1_data = []

@app.route('/')
def index():
    return render_template('index.html')

def read_and_process_data():
    line = ser.readline().decode('utf-8').strip()
    sensorValues = line.split(', ')

    x_vals.append(float(sensorValues[0]))
    sensorValue1_data.append(float(sensorValues[1))

def generate_plot():
    fig = Figure()
    ax = fig.add_subplot(111)
    ax.plot(x_vals, sensorValue1_data, label='Sensor 1')
    ax.set_xlabel('Time')
    ax.set_ylabel('Sensor Values')
    ax.legend()
    canvas = FigureCanvas(fig)
    output = io.BytesIO()
    canvas.print_png(output)
    output.seek(0)
    return output

@app.route('/plot.png')
def plot():
    read_and_process_data()
    output = generate_plot()
    return Response(output.read(), mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
