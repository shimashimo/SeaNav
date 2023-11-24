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
        pressure (list[str]): List containing all pressure data points from 
                              pressure sensor
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
        return {"p_time": self.time[-1], 
                "p_pressure": self.pressure[-1], 
                "p_temperature": self.temperature[-1], 
                "p_depth": self.depth[-1] }

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
    pass

class AngularVelocity(ThreeDegreeSensorData):
    pass

class LinearAcceleration(ThreeDegreeSensorData):
    pass

class Magnetometer(ThreeDegreeSensorData):
    pass

class Accelerometer(ThreeDegreeSensorData):
    pass

class Gravity(ThreeDegreeSensorData):
    pass

class RotationVector(ThreeDegreeSensorData):
    pass


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
    
    def most_recent_data(self)-> dict[str, int | str]:
        """Returns the most recently collected data from imu sensor

        Returns:
            dict[str, int | str]: Dictionary containing most recently 
                                  collected data
        """
        return {"i_acc": self.acc[-1], 
                "i_ori": self.ori[-1], 
                "i_mag": self.mag[-1], 
                "i_ang": self.ang[-1], 
                "i_rot": self.rot[-1], 
                "i_lin": self.lin[-1],
                "i_gra": self.gra[-1],
                "i_cal_sys": self.calibration.system[-1],
                "i_cal_gyro": self.calibration.gyro[-1],
                "i_cal_accel": self.calibration.accel[-1],
                "i_cal_mag": self.calibration.mag[-1],
                }

    