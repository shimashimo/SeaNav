from dataclasses import dataclass

INVALID_DATA_VALUE = None

@dataclass
class PressureSensor():
<<<<<<< Updated upstream
        temperature = INVALID_DATA_VALUE
        pressure = INVALID_DATA_VALUE
=======
    time: any = field(default_factory = lambda:[])
    pressure: any = field(default_factory = lambda:[])
    temperature: any = field(default_factory = lambda:[])
    depth: any = field(default_factory = lambda:[])
>>>>>>> Stashed changes

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
    def __init__(self) -> None:
        self.system = INVALID_DATA_VALUE
        self.gyro = INVALID_DATA_VALUE
        self.accel = INVALID_DATA_VALUE
        self.mag = INVALID_DATA_VALUE

@dataclass
class ThreeDegreeSensorData():
    def __init__(self):
        self.x = INVALID_DATA_VALUE
        self.y = INVALID_DATA_VALUE
        self.z = INVALID_DATA_VALUE


class Orientation(ThreeDegreeSensorData):
    def __init__(self):
        super().__init__()
    pass

class AngularVelocity(ThreeDegreeSensorData):
    def __init__(self):
        super().__init__()
    pass

class LinearAcceleration(ThreeDegreeSensorData):
    def __init__(self):
        super().__init__()
    pass

class Magnetometer(ThreeDegreeSensorData):
    def __init__(self):
        super().__init__()
    pass

class Accelerometer(ThreeDegreeSensorData):
    def __init__(self):
        super().__init__()
    pass

class Gravity(ThreeDegreeSensorData):
    def __init__(self):
        super().__init__()
    pass

class RotationVector(ThreeDegreeSensorData):
    def __init__(self):
        super().__init__()
    pass