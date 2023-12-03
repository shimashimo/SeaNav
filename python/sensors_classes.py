"""
This module includes the classes required to hold all 
sensor data in Python
"""
from __future__ import annotations
from dataclasses import dataclass, field

INVALID_DATA_VALUE = None

@dataclass
class PressureSensor():
    """Pressure sensor data points with helper functions to output real-time 
       data to flask server.

    Attributes:
        time (list[str]): List containing the time each of the correspondingly
                          index data points from pressure, temperature, and 
                          depth
        pressure (list[str]): List containing all pressure data points from pressure 
                              sensor
        temperature (list[str]): List containing all temperature data points 
                                 from pressure sensor
        depth (list[str]): List containing all depth data points from pressure 
                           sensor
    """
    time: list[str] = field(default_factory = lambda:[])
    pressure: list[str] = field(default_factory = lambda:[])
    temperature: list[str] = field(default_factory = lambda:[])
    depth: list[str] = field(default_factory = lambda:[])

    def most_recent_data(self) -> dict[str, int | str]:
        """Pull most recently polled data from Arduino on serial port

        Returns:
            dict[str, int | str]: Dictionary containing the most recent data 
            for flask server to read.
        """
        return {"p_time": self.time[-1] if self.time else 0,
                "p_pressure": self.pressure[-1] if self.pressure else 0,
                "p_temperature": self.temperature[-1] if self.temperature else 0,
                "p_depth": self.depth[-1] if self.depth else 0}

@dataclass
class IMUCalibration():
    """
    IMU Calibration dataclass to hold system, gyro, acceleration, 
    and magnitude calibration data as lists.

    Attributes:
        system (list[str]): List containing all calibration data for system
        gyro (list[str]): List containing all calibration data for gyro
        accel (list[str]): List containing all calibration data for 
                           accelerometer
        mag (list[str]): List containing all calibration data for 
                         magnetometer
    """
    system: list[str] = field(default_factory = lambda:[])
    gyro: list[str] = field(default_factory = lambda:[])
    accel: list[str] = field(default_factory = lambda:[])
    mag: list[str] = field(default_factory = lambda:[])

@dataclass
class ThreeDegreeSensorData():
    """Standard three degree sensor data class for all sensor data off of IMU

    Attributes:
        time (list[str]): List of timestamps for data in three degrees
        x (list[str]): List of x value sensor data
        y (list[str]): List of y value sensor data
        z (list[str]): List of z value sensor data
    """
    time: list[str] = field(default_factory = lambda:[])
    x: list[str] = field(default_factory = lambda:[])
    y: list[str] = field(default_factory = lambda:[])
    z: list[str] = field(default_factory = lambda:[])


class Orientation(ThreeDegreeSensorData):
    """Class for orientation"""

class AngularVelocity(ThreeDegreeSensorData):
    """Class for angular vleocity"""

class LinearAcceleration(ThreeDegreeSensorData):
    """Class for linear acceleration"""

class Magnetometer(ThreeDegreeSensorData):
    """Class for magnetometer"""

class Accelerometer(ThreeDegreeSensorData):
    """Class for accelerometer"""

class Gravity(ThreeDegreeSensorData):
    """Class for gravity"""

class RotationVector(ThreeDegreeSensorData):
    """Class for rotation vector"""

@dataclass
class Quaternion():
    """Quaternion data class for data off of IMU

    Attributes:
        time (list[str]): List of timestamps for data in three degrees
        heading (list[str]): List of heading value sensor data
        pitch (list[str]): List of pitch value sensor data
        roll (list[str]): List of roll value sensor data
    """
    time: list[str] = field(default_factory = lambda:[])
    heading: list[str] = field(default_factory = lambda:[])
    pitch: list[str] = field(default_factory = lambda:[])
    roll: list[str] = field(default_factory = lambda:[])

@dataclass
class IMUSensor():
    """IMU sensor class to store all forms of data from the sensor

    Attributes:
        acc (Accelerometer): Object containing lists for standard three
                             degree sensor data
        ori (Orientation): Object containing lists for standard three
                             degree sensor data
        mag (Magnetometer): Object containing lists for standard three
                             degree sensor data
        ang (AngularVelocity): Object containing lists for standard three
                             degree sensor data
        rot (RotationVector): Object containing lists for standard three
                             degree sensor data
        lin (LinearAcceleration): Object containing lists for standard three
                             degree sensor data
        gra (Gravity): Object containing lists for standard three
                             degree sensor data
        calibration (IMUCalibration): Object containing lists for historical
                                      calibration data
        temperature (list[str]): List containing temperature data from IMU
    """
    acc: Accelerometer = field(default_factory = Accelerometer)
    ori: Orientation = field(default_factory = Orientation)
    mag: Magnetometer = field(default_factory = Magnetometer)
    ang: AngularVelocity = field(default_factory = AngularVelocity)
    rot: RotationVector = field(default_factory = RotationVector)
    lin: LinearAcceleration = field(default_factory = LinearAcceleration)
    gra: Gravity = field(default_factory = Gravity)
    qua: Quaternion = field(default_factory = Quaternion)
    calibration: IMUCalibration = field(default_factory = IMUCalibration)
    temperature: list[str] = field(default_factory = lambda:[])

    def set_generic_sensor(self, time: str, indicator: str, x: str, y: str, z: str) -> None:
        """Appends values to desired class of ThreeDegreeSensor

        Args:
            time (str): Timestamp for incoming data
            indicator (str): Indicator to tell which class of ThreeDegreeSensor
                             the data is being added to
            x (str): Data for x axis
            y (str): Data for y axis
            z (str): Data for z axis
        """
        # Maybe Remove if serial works
        # setattr(getattr(self, indicator), "x", x)
        # setattr(getattr(self, indicator), "y", y)
        # setattr(getattr(self, indicator), "z", z)
        getattr(getattr(self, indicator), "time").append(time)
        getattr(getattr(self, indicator), "x").append(x)
        getattr(getattr(self, indicator), "y").append(y)
        getattr(getattr(self, indicator), "z").append(z)

    def set_quat_data(self, time: str, heading: str, pitch: str, roll:str) -> None:
        """Appends values to quat data

        Args:
            time (str): Timestamp for incoming data
            heading (str): Data for heading axis
            pitch (str): Data for pitch axis
            roll (str): Data for roll axis
        """
        self.qua.time.append(time)
        self.qua.heading.append(heading)
        self.qua.pitch.append(pitch)
        self.qua.roll.append(roll)

    def write_to_matlab_file(self, path: str) -> None:
        """
        Write data collected from IMU currently in Python to a data file
        for further analysis in Matlab, including IMU position history.

        Args:
            path (str): Path to write the data file to.
        """
        # Open file
        with open(path, "w", encoding="utf-8") as file:
            # go through each point in data storage
            for element_index, _ in enumerate(self.acc.x):
                # Store as string, while converting rad to degrees
                line = (self.acc.x[element_index] + "\t"
                       + self.acc.y[element_index] + "\t"
                       + self.acc.z[element_index] + "\t"
                       + str(float(self.ang.x[element_index])*57.2958) + "\t"
                       + str(float(self.ang.y[element_index])*57.2958) + "\t"
                       + str(float(self.ang.z[element_index])*57.2958) + "\t"
                       )
                file.write("0x50\t" + self.acc.time[element_index] + "\t" + line  + "\n")





    def most_recent_data(self)-> dict[str, int | str]:
        """Returns the most recently collected data from imu sensor

        Returns:
            dict[str, int | str]: Dictionary containing most recently 
                                  collected data
        """
        return {"i_acc_x": self.acc.x[-1] if self.acc.x else 0,
                "i_acc_y": self.acc.y[-1] if self.acc.y else 0,
                "i_acc_z": self.acc.z[-1] if self.acc.y else 0,
                "i_ori_x": self.ori.x[-1] if self.ori.x else 0,
                "i_ori_y": self.ori.y[-1] if self.ori.y else 0,
                "i_ori_z": self.ori.z[-1] if self.ori.z else 0,
                "i_mag_x": self.mag.x[-1] if self.mag.x else 0,
                "i_mag_y": self.mag.y[-1] if self.mag.y else 0,
                "i_mag_z": self.mag.z[-1] if self.mag.z else 0,
                "i_ang_x": self.ang.x[-1] if self.ang.x else 0,
                "i_ang_y": self.ang.y[-1] if self.ang.y else 0,
                "i_ang_z": self.ang.z[-1] if self.ang.z else 0,
                "i_rot_x": self.rot.x[-1] if self.rot.x else 0,
                "i_rot_y": self.rot.y[-1] if self.rot.y else 0,
                "i_rot_z": self.rot.z[-1] if self.rot.z else 0,
                "i_lin_x": self.lin.x[-1] if self.lin.x else 0,
                "i_lin_y": self.lin.y[-1] if self.lin.y else 0,
                "i_lin_z": self.lin.z[-1] if self.lin.z else 0,
                "i_gra_x": self.gra.x[-1] if self.gra.x else 0,
                "i_gra_y": self.gra.y[-1] if self.gra.y else 0,
                "i_gra_z": self.gra.z[-1] if self.gra.z else 0,
                "i_qua_head": self.qua.heading[-1] if self.qua.heading else 0,
                "i_qua_pitch": self.qua.pitch[-1] if self.qua.pitch else 0,
                "i_qua_roll": self.qua.roll[-1] if self.qua.roll else 0,
                "i_cal_sys": self.calibration.system[-1] if self.calibration.system else 0,
                "i_cal_gyro": self.calibration.gyro[-1] if self.calibration.gyro else 0,
                "i_cal_accel": self.calibration.accel[-1] if self.calibration.accel else 0,
                "i_cal_mag": self.calibration.mag[-1] if self.calibration.mag else 0,
                }


@dataclass
class DistanceSensor():
    """Distance sensor class to store all distance sensor data

    Attributes:
        time (list[str]): list of timestamps for data
        distance (list[str]): list of distance values
    """
    time: list[str] = field(default_factory = lambda:[])
    distance: list[str] = field(default_factory = lambda:[])

    def most_recent_data(self) -> dict[str, int | str]:
        """Pull most recently polled data from Arduino on serial port

        Returns:
            dict[str, int | str]: Dictionary containing the most recent data 
            for flask server to read.
        """
        return {"d_time": self.time[-1] if self.time else 0,
                "d_distance": self.distance[-1] if self.distance else 0
                }
