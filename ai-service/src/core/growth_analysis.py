import numpy as np
from datetime import datetime, timedelta
import logging

class GrowthAnalyzer:
    def __init__(self):
        self.history_data = [] # List of tuples (timestamp, avg_weight)

    def load_data(self, history_list):
        """
        Load dữ liệu từ lịch sử đếm.
        history_list: List các dict chứa kết quả đếm (từ gui.py)
        """
        self.history_data = []
        for record in history_list:
            try:
                # Parse timestamp
                ts_str = record.get('timestamp')
                count = float(record.get('count', 0))
                biomass = float(record.get('biomass', 0))
                
                if count > 0 and ts_str:
                    dt = datetime.strptime(ts_str, "%Y-%m-%d %H:%M:%S")
                    avg_weight = biomass / count
                    self.history_data.append((dt, avg_weight))
            except Exception as e:
                logging.warning(f"Skipping invalid record: {e}")
        
        # Sắp xếp theo thời gian
        self.history_data.sort(key=lambda x: x[0])

    def get_regression_model(self):
        """
        Tính toán mô hình hồi quy tuyến tính.
        Trả về: (slope, intercept, r_squared, start_date)
        """
        if len(self.history_data) < 2:
            return None, None, 0, None

        start_date = self.history_data[0][0]
        X = []
        Y = []
        
        for dt, weight in self.history_data:
            days = (dt - start_date).total_seconds() / 86400.0
            X.append(days)
            Y.append(weight)
            
        X = np.array(X)
        Y = np.array(Y)
        
        try:
            slope, intercept = np.polyfit(X, Y, 1)
            
            # Tính R-squared
            y_pred = slope * X + intercept
            residuals = Y - y_pred
            ss_res = np.sum(residuals**2)
            ss_tot = np.sum((Y - np.mean(Y))**2)
            r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
            
            return slope, intercept, r_squared, start_date
        except Exception as e:
            logging.error(f"Error in regression: {e}")
            return None, None, 0, None

    def predict_growth(self, target_weight):
        """
        Dự đoán ngày đạt trọng lượng mục tiêu dùng Hồi quy tuyến tính.
        """
        slope, intercept, r_squared, start_date = self.get_regression_model()
        
        if slope is None:
            return None, None, 0, 0
            
        growth_rate = slope
        
        if growth_rate <= 0:
            return -1, None, growth_rate, r_squared
        
        # Dự đoán
        # y = ax + b => x = (y - b) / a
        days_needed = (target_weight - intercept) / slope
        
        # Nếu ngày cần thiết < 0 (tức là đã đạt được trong quá khứ theo lý thuyết), 
        # ta vẫn tính toán để hiển thị trên biểu đồ
        
        predicted_date = start_date + timedelta(days=days_needed)
        days_from_now = (predicted_date - datetime.now()).days
        
        return days_from_now, predicted_date, growth_rate, r_squared
