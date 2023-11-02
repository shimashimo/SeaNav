
INVALID_DATA_VALUE = None

class PressureSensor():
    temperature = INVALID_DATA_VALUE
    pressure = INVALID_DATA_VALUE

class IMUSensor():
    acc = Accelerometer()
    ori = Orientation()
    mag = Magnetometer()
    ang = AngularVelocity()
    rot = RotationVector()
    lin = LinearAcceleration()
    gra = Gravity()
    calibration = IMUCalibration()
    temp = INVALID_DATA_VALUE


class IMUCalibration():
    system = INVALID_DATA_VALUE
    gyro = INVALID_DATA_VALUE
    accel = INVALID_DATA_VALUE
    mag = INVALID_DATA_VALUE

class ThreeDegreeSensorData():
    x = INVALID_DATA_VALUE
    y = INVALID_DATA_VALUE
    z = INVALID_DATA_VALUE


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