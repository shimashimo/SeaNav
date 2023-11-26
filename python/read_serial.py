"""Module to read Arduino serial data and put into Python classes"""
import serial
from python.sensors_classes import PressureSensor, IMUSensor, DistanceSensor

# For error checking during serial transmission
IMU_MESSAGE_LENGTH = 6
CALIBRATION_MESSAGE_LENGTH = 8
QUAT_MESSAGE_LENGTH = 6
PRESSURE_MESSAGE_LENGTH = 5
DISTANCE_MESSAGE_LENGTH = 3

VALID_IMU_MESSAGE_LENGTHS = [IMU_MESSAGE_LENGTH, CALIBRATION_MESSAGE_LENGTH, QUAT_MESSAGE_LENGTH]
VALID_IMU_SUBTYPES = ["ori", "ang", "lin", "mag", "acc", "gra", "qua", "cal"]
VALID_IMU_XYZ_SUBTYPES = ["ori", "ang", "lin", "mag", "acc", "gra", "qua"]

#Constants for Standard IMU Message
(
    TIME_INDEX,
    MESSAGE_TYPE_INDEX,
    SUB_TYPE_INDEX,
    X_INDEX,
    Y_INDEX,
    Z_INDEX,
) = range(0, IMU_MESSAGE_LENGTH)

#Constants for Calibration IMU Message
(
    TIME_INDEX,
    MESSAGE_TYPE_INDEX,
    CAL_SUB_TYPE_INDEX,
    SYSTEM_INDEX,
    GYRO_INDEX,
    ACCEL_INDEX,
    MAG_INDEX,
    IMU_TEMP_INDEX,
) = range(0, CALIBRATION_MESSAGE_LENGTH)

#Constants for Quaternion IMU Message
(
    TIME_INDEX,
    MESSAGE_TYPE_INDEX,
    QUAT_SUB_TYPE_INDEX,
    HEADING_INDEX,
    PITCH_INDEX,
    ROLL_INDEX,
) = range(0, QUAT_MESSAGE_LENGTH)

#Constants for Pressure Message
(
    TIME_INDEX,
    MESSAGE_TYPE_INDEX,
    TEMPERATURE_INDEX,
    PRESSURE_INDEX,
    DEPTH_INDEX
) = range(0, PRESSURE_MESSAGE_LENGTH)

#Constants for Distance Message
(
    TIME_INDEX,
    MESSAGE_TYPE_INDEX,
    DISTANCE_INDEX,
) = range(0, DISTANCE_MESSAGE_LENGTH)

def parse_pressure_message(pressure_data: PressureSensor, message_line: str) -> None:
    """
    Parse pressure message from Arduino
    Sample Message "1.24,p,20,100" for "time,message_type,temperature,pressure"

    Args:
        pressure_data (PressureSensor): PressureSensor object to store 
                                        message data to
        message_line (str): Arduino serial port message to be parsed
    """
    # Store message information in PressureSensor object.
    pressure_data.time.append(message_line[TIME_INDEX])
    pressure_data.temperature.append(message_line[TEMPERATURE_INDEX])
    pressure_data.pressure.append(message_line[PRESSURE_INDEX])
    pressure_data.depth.append(message_line[DEPTH_INDEX])

def parse_imu_message(imu_data: IMUSensor, message_line: str) -> None:
    """
    Parse imu message from Arduino
    Sample message "1.00,i,ori,1,2,3" for "time,message_type,subtype,x,y,z"


    Args:
        imu_data (IMUSensor): IMUSensor object to store message data to
        message_line (str): Arduino serial port message to be parsed
    """

    # Store message information in IMUSensor object.

    # Only store if a valid subtype is inputted
    if message_line[SUB_TYPE_INDEX] in VALID_IMU_SUBTYPES:
        if message_line[SUB_TYPE_INDEX] == "unk": # Invalid message
            print("Message Unknown")
        elif len(message_line) == CALIBRATION_MESSAGE_LENGTH and message_line[CAL_SUB_TYPE_INDEX] == "cal": # Valid cal message, copy values
            imu_data.calibration.system.append(message_line[SYSTEM_INDEX])
            imu_data.calibration.gyro.append(message_line[GYRO_INDEX])
            imu_data.calibration.accel.append(message_line[ACCEL_INDEX])
            imu_data.calibration.mag.append(message_line[MAG_INDEX])
            imu_data.temperature.append(message_line[IMU_TEMP_INDEX])
        elif len(message_line) == QUAT_MESSAGE_LENGTH and message_line[SUB_TYPE_INDEX] == "qua":
            imu_data.set_quat_data(message_line[TIME_INDEX], message_line[HEADING_INDEX],
                                message_line[PITCH_INDEX], message_line[ROLL_INDEX])
        elif len(message_line) == IMU_MESSAGE_LENGTH and message_line[SUB_TYPE_INDEX] in VALID_IMU_XYZ_SUBTYPES: # Valid standard message, copy x, y, and z values
            imu_data.set_generic_sensor(message_line[TIME_INDEX], message_line[SUB_TYPE_INDEX],
                                        message_line[X_INDEX], message_line[Y_INDEX],
                                        message_line[Z_INDEX])

def parse_distance_message(distance_data: DistanceSensor, message_line: str) -> None:
    """
    Parse distance message from Arduino
    Sample Message "1.23,d,250" for "time,message_type,distance"
    Distance is in mm.

    Args:
        distance_data (DistanceSensor): DistanceSensor object to store 
                                        message data to
        message_line (str): Arduino serial port message to be parsed
    """
    # Store message information in PressureSensor object.
    distance_data.time.append(message_line[TIME_INDEX])
    distance_data.distance.append(message_line[DISTANCE_INDEX])

def read_serial_data(ser: serial.Serial, pressure_data: PressureSensor,
                     imu_data: IMUSensor, distance_data: DistanceSensor) -> None:
    """
    Determine what type of message is in serial port and store data in
    correct object

    Args:
        pressure_data (PressureSensor): PressureSensor object to store 
                                        serial data
        imu_data (IMUSensor): IMUSensor object to store serial data
    """
    line = ser.readline().decode('utf-8', errors = "ignore").strip()
    

    #print(line)
    message_line = line.split(',')
    #print( "(" + str(message_line) + ")")
    # Message is of pressure data
    if len(message_line) == PRESSURE_MESSAGE_LENGTH and message_line[MESSAGE_TYPE_INDEX] == 'p':
        parse_pressure_message(pressure_data, message_line)
    elif (len(message_line) in VALID_IMU_MESSAGE_LENGTHS) and (message_line[MESSAGE_TYPE_INDEX] == 'i'):
        parse_imu_message(imu_data, message_line)
    elif len(message_line) == DISTANCE_MESSAGE_LENGTH and message_line[MESSAGE_TYPE_INDEX] == "d" :
        parse_distance_message(distance_data, message_line)

# pressure_data = PressureSensor()
# imu_data = IMUSensor()

# while True:
#     read_serial_data(serial_port, pressure_data, imu_data)
#     print(str(pressure_data) + "\n")
#     print(str(imu_data) + "\n")
