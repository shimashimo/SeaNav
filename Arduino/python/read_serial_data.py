import serial
import platform

#Constants for IMU Message
(
    MESSAGE_TYPE_INDEX,
    PRESSURE_READING_INDEX,
    
) = range(0, 10)

#Constants for Pressure Message
(
    MESSAGE_TYPE_INDEX,
    PRESSURE_INDEX,
    TEMPERATURE_INDEX,
    
) = range(0, 3)


# Constants depending on platform
if (platform.system() == "Darwin"):
    SERIAL_PORT = "/dev/cu.usbmodem1401"
else:
    SERIAL_PORT = "COM4" 

BAUD_RATE = 115200  

# Initialize serial connection
ser = serial.Serial(SERIAL_PORT, BAUD_RATE)

def parse_pressure_message():
    pass

def parse_imu_message():
    pass

def read_serial_data():
    line = ser.readline().decode('utf-8').strip()
    sensorValues = line.split(',')
    print(sensorsValues)
    # Message is of pressure data
    if sensorValues[MESSAGE_TYPE_INDEX] == 'p':
        parse_pressure_message()
    elif sensorsValues[MESSAGE_TYPE_INDEX] == 'i':
        parse_imu_message()



