import cv2
import numpy as np

class KalmanFilter:
    def __init__(self, dt=0.1, u_x=1, u_y=1, std_acc=1, x_std_meas=0.1, y_std_meas=0.1):
        # Khởi tạo Kalman Filter cho tracking object
        self.kalman = cv2.KalmanFilter(4, 2)
        self.kalman.measurementMatrix = np.array([[1, 0, 0, 0], [0, 1, 0, 0]], np.float32)
        self.kalman.transitionMatrix = np.array([
            [1, 0, dt, 0], 
            [0, 1, 0, dt], 
            [0, 0, 1, 0], 
            [0, 0, 0, 1]
        ], np.float32)
        self.kalman.processNoiseCov = np.array([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ], np.float32) * std_acc
        self.kalman.measurementNoiseCov = np.array([
            [x_std_meas**2, 0],
            [0, y_std_meas**2]
        ], np.float32)
        
        self.predicted = None
        self.age = 0
        self.hits = 0
        self.last_position = None

    def predict(self):
        
        # Predict next position
        self.predicted = self.kalman.predict()
        return (float(self.predicted[0]), float(self.predicted[1]))
        
    def correct(self, x, y):
        # Update with new measurement (correct instead of update)
        measurement = np.array([[np.float32(x)], [np.float32(y)]])
        self.kalman.correct(measurement)
        self.last_position = (float(x), float(y))
        self.hits += 1
        self.age = 0
        
    def increment_age(self):
        self.age += 1
        
    def get_state(self):
        return {
            'predicted': None if self.predicted is None else (float(self.predicted[0]), float(self.predicted[1])),
            'age': self.age,
            'hits': self.hits,
            'last_position': self.last_position
        } 