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
pressure_data = []

# Create function to update the plot
def update_plot(frame):
    read_serial.read_serial_data(pressure_sensor_obj, imu_sensor_obj)
    
    # print(pressure_sensor_obj.time)
    # print(pressure_sensor_obj.pressure)
    # Append the time and pressure data
    # x_vals.append(np.asarray(pressure_sensor_obj.time,)
    # pressure_data.append(pressure_sensor_obj.pressure))

    # Update the first subplot (pressure data)
    ax1.clear()
    ax1.plot(np.asarray(pressure_sensor_obj.time, float), np.asarray(pressure_sensor_obj.pressure, float))
    ax1.set_xlabel('Time [s]')
    ax1.set_ylabel('Pressure [hPa]')


    # Update the second subplot (depth data)
    ax2.clear()
    ax2.plot(np.asarray(pressure_sensor_obj.time, float), np.asarray(pressure_sensor_obj.depth, float))
    ax2.set_xlabel('Time [s]')
    ax2.set_ylabel('Depth [cm]')

# Create function to save data to CSV file when the plot window is closed
# def on_close(event):
#     with open('arduino_data.csv', 'w', newline='') as csvfile:
#         writer = csv.writer(csvfile)
#         writer.writerow(['Time', 'Pressure', 'Depth'])
#         for x, pressure, depth in zip(x_vals, pressure_data, depth_data):
#             writer.writerow([x, pressure, depth])

# Register the callback function for when the plot window is closed
fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True)

# Set up the subplots
ax1.set_ylim(0, 2000)  # Adjust the limits as needed
ax1.grid()
ax1.set_title('Pressure Data')
ax1.ticklabel_format(style='plain')

ax2.set_ylim(0, 100)  # Adjust the limits as needed
ax2.grid()
ax2.set_title('Depth Data')

# Register the callback function for when the plot window is closed
# fig.canvas.mpl_connect('close_event', on_close)

ani = FuncAnimation(fig, update_plot, interval=10, cache_frame_data=False)
plt.show()
