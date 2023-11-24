from __future__ import annotations
from dataclasses import dataclass, field

INVALID_DATA_VALUE = None

@dataclass
class PressureSensor():
    time: list[str] = field(default_factory = lambda:[])
    pressure: list[str] = field(default_factory = lambda:[])
    temperature: list[str] = field(default_factory = lambda:[])
    depth: list[str] = field(default_factory = lambda:[])

    def most_recent_data(self) -> dict[str,int | str]:
        return {"p_time": self.time[-1], "p_pressure": self.pressure[-1], "p_temperature": self.temperature[-1], "p_depth": self.depth[-1]}


@dataclass
class IMUSensor():
    def __init__(self) -> None:
        self.acc = Accelerometer()
        self.ori = Orientation()
        self.mag = Magnetometer()
        self.ang = AngularVelocity()
        self.rot = RotationVector()
        self.lin = LinearAcceleration()
        self.gra = Gravity()
        self.calibration = IMUCalibration()
        self.temp = INVALID_DATA_VALUE


@dataclass
class IMUCalibration():
    system: list[str] = field(default_factory = lambda:[])
    gyro: list[str] = field(default_factory = lambda:[])
    accel: list[str] = field(default_factory = lambda:[])
    mag: list[str] = field(default_factory = lambda:[])

@dataclass
class ThreeDegreeSensorData():
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
    acc: Accelerometer = field(default_factory = Accelerometer)
    ori: Orientation = field(default_factory = Orientation)
    mag: Magnetometer = field(default_factory = Magnetometer)
    ang: AngularVelocity = field(default_factory = AngularVelocity)
    rot: RotationVector = field(default_factory = RotationVector)
    lin: LinearAcceleration = field(default_factory = LinearAcceleration)
    gra: Gravity = field(default_factory = Gravity)
    calibration: IMUCalibration = field(default_factory = IMUCalibration)
    temperature: list[str] = field(default_factory = lambda:[])

    def set_generic_sensor(self, time, indicator, x, y, z):
        # setattr(getattr(self, indicator), "x", x)
        # setattr(getattr(self, indicator), "y", y)
        # setattr(getattr(self, indicator), "z", z)
        getattr(getattr(self, indicator), "time").append(time)
        getattr(getattr(self, indicator), "x").append(x)
        getattr(getattr(self, indicator), "y").append(y)
        getattr(getattr(self, indicator), "z").append(z)
    
    def most_recent_data(self)-> dict[str, int | str]:
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

    