import serial
import platform
from sensors_classes import PressureSensor, IMUSensor, Accelerometer


#Constants for Standard IMU Message
(
    MESSAGE_TYPE_INDEX,
    SUB_TYPE_INDEX,
    X_INDEX,
    Y_INDEX,
    Z_INDEX,
) = range(0, 5)

#Constants for Calibration IMU Message
(
    MESSAGE_TYPE_INDEX,
    SYSTEM_INDEX,
    GYRO_INDEX,
    ACCEL_INDEX,
    MAG_INDEX,
    IMU_TEMP_INDEX,
) = range(0, 6)

#Constants for Pressure Message
(
    MESSAGE_TYPE_INDEX,
    TEMPERATURE_INDEX,
    PRESSURE_INDEX,
<<<<<<< Updated upstream:Arduino/python/read_serial_data.py
) = range(0, 3)
=======
    DEPTH_INDEX
) = range(0, 5)
>>>>>>> Stashed changes:Arduino/python/read_serial.py


# Constants depending on platform
if (platform.system() == "Darwin"):
    SERIAL_PORT = "/dev/cu.usbmodem1301"
else:
    SERIAL_PORT = "COM3" 

BAUD_RATE = 115200  

# Initialize serial connection
ser = serial.Serial(SERIAL_PORT, BAUD_RATE)

def parse_pressure_message(pressure_data, message_line):
    # Sample Message "p,20,100" for "message_type,temperature,pressure"

    # Store message information in PressureSensor object.
<<<<<<< Updated upstream:Arduino/python/read_serial_data.py
    pressure_data.temperature = message_line[TEMPERATURE_INDEX]
    pressure_data.pressure = message_line[PRESSURE_INDEX]
=======
    pressure_data.time.append(message_line[TIME_INDEX])
    pressure_data.temperature.append(message_line[TEMPERATURE_INDEX])
    pressure_data.pressure.append(message_line[PRESSURE_INDEX])
    pressure_data.depth.append(message_line[DEPTH_INDEX])
>>>>>>> Stashed changes:Arduino/python/read_serial.py

def parse_imu_message(imu_data, message_line):
    # Sample message "i,ori,1,2,3" for "message_type,subtype,x,y,z"

    # Store message information in IMUSensor object.
    if message_line[SUB_TYPE_INDEX] == "unk": # Invalid message
        print("Message Unknown")
        
    elif message_line[SUB_TYPE_INDEX] == "cal": # Valid cal message, copy values
        imu_data.calibration.system = message_line[SYSTEM_INDEX]
        imu_data.calibration.gyro = message_line[GYRO_INDEX]
        imu_data.calibration.accel = message_line[ACCEL_INDEX]
        imu_data.calibration.mag = message_line[MAG_INDEX]
        imu_data.calibration.temp = message_line[IMU_TEMP_INDEX]

    else: # Valid standard message, copy x, y, and z values
        setattr(imu_data, message_line[SUB_TYPE_INDEX].x, message_line[X_INDEX])
        setattr(imu_data, message_line[SUB_TYPE_INDEX].y, message_line[Y_INDEX])
        setattr(imu_data, message_line[SUB_TYPE_INDEX].z, message_line[Z_INDEX])

def read_serial_data(pressure_data, imu_data):

    line = ser.readline().decode('utf-8').strip()
    message_line = line.split(',')
    # Message is of pressure data
    # print(message_line)
    if message_line[MESSAGE_TYPE_INDEX] == 'p':
        parse_pressure_message(pressure_data, message_line)
    elif message_line[MESSAGE_TYPE_INDEX] == 'i':
        parse_imu_message(imu_data, message_line)

while True:
    pressure_data = PressureSensor()
    imu_data = IMUSensor()
    read_serial_data(pressure_data, imu_data)
    print(pressure_data)
    print(imu_data)
