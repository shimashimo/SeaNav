from dataclasses import dataclass, field

INVALID_DATA_VALUE = None

@dataclass
class IMUCalibration():
    system: any = INVALID_DATA_VALUE
    gyro: any = INVALID_DATA_VALUE
    accel: any = INVALID_DATA_VALUE
    mag: any = INVALID_DATA_VALUE

@dataclass
class ThreeDegreeSensorData():
    x: any = INVALID_DATA_VALUE
    y: any = INVALID_DATA_VALUE
    z: any = INVALID_DATA_VALUE


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
class PressureSensor():
    temperature: any = INVALID_DATA_VALUE
    pressure: any = INVALID_DATA_VALUE

@dataclass
class IMUSensor():
    acc: any = field(default_factory = Accelerometer)
    ori: any = field(default_factory = Orientation)
    mag: any = field(default_factory = Magnetometer)
    ang: any = field(default_factory = AngularVelocity)
    rot: any = field(default_factory = RotationVector)
    lin: any = field(default_factory = LinearAcceleration)
    gra: any = field(default_factory = Gravity)
    calibration: any = field(default_factory = IMUCalibration)
    temp: any = INVALID_DATA_VALUE

    def set_generic_sensor(self, indicator, x, y, z):
        setattr(getattr(self, indicator), "x", x)
        setattr(getattr(self, indicator), "y", y)
        setattr(getattr(self, indicator), "z", z)
    