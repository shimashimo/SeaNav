import serial
import read_serial as read_serial
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import csv
import numpy as np

# Constants
SERIAL_PORT = "/dev/cu.usbmodem1401"
BAUD_RATE = 115200

imu_sensor_obj = read_serial.IMUSensor()
pressure_sensor_obj = read_serial.PressureSensor()


# Initialize serial connection
ser = serial.Serial(SERIAL_PORT, BAUD_RATE)

# Initialize empty lists to store data
x_vals = []
sensorValue1_data = []
# sensorValue2_data = []


# Create function to update the plot
def update_plot(frame):
    read_serial.read_serial_data(pressure_sensor_obj, imu_sensor_obj)
    plt.cla()
    # plt.plot(np.asarray(imu_sensor_obj.acc.time, float), np.asarray(imu_sensor_obj.acc.x, float), label='IMU Accel X value')
    plt.plot(np.asarray(pressure_sensor_obj.time, float), np.asarray(pressure_sensor_obj.pressure, float))
    plt.xlabel('Time [s]')
    plt.ylabel('Pressure [hPa]')
    # plt.legend()

# Create function to save data to CSV file when the plot window closed
def on_close(event):
    with open('arduino_data.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Time', 'Sensor1'])
        for x, s1, s2 in zip(x_vals, sensorValue1_data):
            writer.writerow([x, s1, s2])

#register the callback function for when the plot window is closed
fig, ax = plt.subplots()
fig.canvas.mpl_connect('close_event', on_close)

ani = FuncAnimation(fig, update_plot, interval=10, cache_frame_data=False)
plt.show()