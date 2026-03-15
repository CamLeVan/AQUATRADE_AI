import sys
import os
import cv2
import numpy as np
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                           QHBoxLayout, QPushButton, QLabel, QTableWidget, 
                           QTableWidgetItem, QMessageBox, QFileDialog, QHeaderView,
                           QComboBox, QGroupBox, QRadioButton, QButtonGroup, QFrame,
                           QGridLayout, QSizePolicy, QProgressBar, QDialog, QDoubleSpinBox)
from PyQt5.QtCore import Qt, QThread, pyqtSignal, QTimer, QSize
from PyQt5.QtGui import QImage, QPixmap, QFont, QIcon, QColor, QPalette
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.dates as mdates
import json
from datetime import datetime, timedelta
import logging
import time

# Import FishCounter từ core
# Import FishCounter từ core
from src.core.fish_counter import FishCounter
from src.core.growth_analysis import GrowthAnalyzer

# --- STYLESHEET ---
MODERN_STYLE = """
QMainWindow {
    background-color: #121212;
    color: #ffffff;
}

QWidget {
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
}

QGroupBox {
    background-color: #1e1e1e;
    border: 1px solid #333333;
    border-radius: 8px;
    margin-top: 1.5em;
    padding-top: 10px;
    color: #e0e0e0;
    font-weight: bold;
}

QGroupBox::title {
    subcontrol-origin: margin;
    left: 10px;
    padding: 0 5px;
    color: #4db8ff;
}

QPushButton {
    background-color: #2d2d2d;
    color: #ffffff;
    border: 1px solid #3d3d3d;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
}

QPushButton:hover {
    background-color: #3d3d3d;
    border-color: #4db8ff;
}

QPushButton:pressed {
    background-color: #4db8ff;
    color: #000000;
}

QPushButton:disabled {
    background-color: #1a1a1a;
    color: #555555;
    border-color: #2a2a2a;
}

QPushButton#start_btn {
    background-color: #007acc;
    border: none;
}
QPushButton#start_btn:hover {
    background-color: #0098ff;
}

QPushButton#stop_btn {
    background-color: #d32f2f;
    border: none;
}
QPushButton#stop_btn:hover {
    background-color: #f44336;
}

QLabel {
    color: #e0e0e0;
}

QLabel#stat_value {
    font-size: 24px;
    font-weight: bold;
    color: #4db8ff;
}

QLabel#stat_title {
    font-size: 12px;
    color: #aaaaaa;
}

QTableWidget {
    background-color: #1e1e1e;
    border: 1px solid #333333;
    border-radius: 8px;
    gridline-color: #333333;
    color: #e0e0e0;
}

QTableWidget::item {
    padding: 5px;
}

QTableWidget::item:selected {
    background-color: #2d2d2d;
    color: #4db8ff;
}

QHeaderView::section {
    background-color: #2d2d2d;
    color: #ffffff;
    padding: 5px;
    border: none;
    border-bottom: 1px solid #333333;
}

QRadioButton {
    color: #e0e0e0;
    spacing: 8px;
}

QRadioButton::indicator {
    width: 16px;
    height: 16px;
    border-radius: 8px;
    border: 2px solid #555555;
}

QRadioButton::indicator:checked {
    background-color: #4db8ff;
    border-color: #4db8ff;
}
"""

class StatCard(QFrame):
    def __init__(self, title, value, unit="", parent=None):
        super().__init__(parent)
        self.setFrameShape(QFrame.StyledPanel)
        self.setStyleSheet("""
            StatCard {
                background-color: #1e1e1e;
                border: 1px solid #333333;
                border-radius: 8px;
            }
        """)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(15, 15, 15, 15)
        
        self.title_label = QLabel(title)
        self.title_label.setObjectName("stat_title")
        layout.addWidget(self.title_label)
        
        self.value_label = QLabel(value)
        self.value_label.setObjectName("stat_value")
        layout.addWidget(self.value_label)
        
        self.unit = unit

    def set_value(self, value):
        self.value_label.setText(f"{value}{self.unit}")

class VideoThread(QThread):
    frame_updated = pyqtSignal(np.ndarray, int, float, float)
    counting_finished = pyqtSignal(int)

    def __init__(self, fish_counter):
        super().__init__()
        self.fish_counter = fish_counter
        self.is_running = False
        self.duration = 30
        self.start_time = None

    def run(self):
        try:
            self.is_running = True
            self.start_time = time.time()
            
            while self.is_running:
                elapsed_time = time.time() - self.start_time
                result = self.fish_counter.process_frame()
                
                if result[0] is not None:
                    # Unpack 6 giá trị từ process_frame
                    frame, count, elapsed_time, total_biomass, fai, has_dead_fish = result
                    # Emit signal vẫn giữ nguyên 4 tham số cũ để tương thích slot
                    self.frame_updated.emit(frame, count, elapsed_time, total_biomass)
                
                if elapsed_time >= self.duration:
                    self.counting_finished.emit(count)
                    break
                
                self.msleep(30)
                
        except Exception as e:
            logging.error(f"Error in video thread: {e}")
            self.is_running = False

    def stop(self):
        self.is_running = False
        self.wait()

class GrowthPredictionDialog(QDialog):
    def __init__(self, history_data, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Phân Tích & Dự Báo Tăng Trưởng")
        self.resize(900, 700)
        self.setStyleSheet("background-color: #2b2b2b; color: white;")
        
        self.analyzer = GrowthAnalyzer()
        self.analyzer.load_data(history_data)
        
        self.init_ui()
        self.analyze() # Run initial analysis

    def init_ui(self):
        layout = QVBoxLayout(self)
        
        # 1. Input Area
        input_layout = QHBoxLayout()
        input_layout.addWidget(QLabel("Trọng lượng mục tiêu (g):"))
        
        self.target_spin = QDoubleSpinBox()
        self.target_spin.setRange(0, 10000)
        self.target_spin.setValue(1000)
        self.target_spin.setSingleStep(50)
        self.target_spin.setStyleSheet("""
            QDoubleSpinBox {
                background-color: #3e3e3e;
                color: white;
                padding: 5px;
                border: 1px solid #555;
                font-size: 14px;
            }
        """)
        self.target_spin.valueChanged.connect(self.analyze)
        input_layout.addWidget(self.target_spin)
        
        analyze_btn = QPushButton("Cập nhật Dự báo")
        analyze_btn.setStyleSheet("""
            QPushButton {
                background-color: #007acc;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover { background-color: #0098ff; }
        """)
        analyze_btn.clicked.connect(self.analyze)
        input_layout.addWidget(analyze_btn)
        input_layout.addStretch()
        
        layout.addLayout(input_layout)
        
        # 2. Chart Area
        self.figure = Figure(figsize=(8, 5), dpi=100, facecolor='#2b2b2b')
        self.canvas = FigureCanvas(self.figure)
        self.ax = self.figure.add_subplot(111)
        self.ax.set_facecolor('#2b2b2b')
        layout.addWidget(self.canvas)
        
        # 3. Stats Area
        self.stats_label = QLabel("Đang phân tích...")
        self.stats_label.setStyleSheet("""
            background-color: #333;
            padding: 15px;
            border-radius: 5px;
            font-size: 14px;
            border: 1px solid #444;
        """)
        self.stats_label.setWordWrap(True)
        layout.addWidget(self.stats_label)

    def analyze(self):
        target_weight = self.target_spin.value()
        slope, intercept, r2, start_date = self.analyzer.get_regression_model()
        
        self.ax.clear()
        self.ax.grid(True, color='#444', linestyle='--')
        self.ax.set_xlabel("Thời gian", color='white')
        self.ax.set_ylabel("Khối lượng (g)", color='white')
        self.ax.tick_params(axis='x', colors='white', rotation=45)
        self.ax.tick_params(axis='y', colors='white')
        
        # Plot History
        dates = [d for d, w in self.analyzer.history_data]
        weights = [w for d, w in self.analyzer.history_data]
        self.ax.plot(dates, weights, 'o', color='#00aaff', label='Lịch sử đo', markersize=8, zorder=3)
        
        msg = ""
        
        if slope is not None and slope > 0:
            # Calculate Prediction
            days_needed = (target_weight - intercept) / slope
            pred_date = start_date + timedelta(days=days_needed)
            
            # Plot Trendline
            # Create a range of dates from start to prediction
            future_days = (pred_date - start_date).days
            x_vals = np.linspace(0, future_days, 100)
            y_vals = slope * x_vals + intercept
            
            date_vals = [start_date + timedelta(days=d) for d in x_vals]
            
            self.ax.plot(date_vals, y_vals, '--', color='#ffaa00', label='Xu hướng dự báo', linewidth=2)
            
            # Plot Target Point
            self.ax.plot([pred_date], [target_weight], '*', color='#00ff00', markersize=15, label='Mục tiêu', zorder=4)
            
            # Format Date Axis
            self.ax.xaxis.set_major_formatter(mdates.DateFormatter('%d/%m'))
            
            days_left = (pred_date - datetime.now()).days
            confidence = "Cao" if r2 > 0.8 else ("Trung bình" if r2 > 0.5 else "Thấp")
            
            msg = (f"🎯 <b>KẾT QUẢ DỰ BÁO</b><br><br>"
                   f"📅 Ngày đạt mục tiêu: <b style='color:#00ff00'>{pred_date.strftime('%d/%m/%Y')}</b><br>"
                   f"⏳ Còn lại: <b>{int(days_left)} ngày</b><br>"
                   f"📈 Tốc độ lớn: <b>{slope:.2f} g/ngày</b><br>"
                   f"🔍 Độ tin cậy: {confidence} (R²={r2:.2f})")
        else:
            msg = "⚠️ <b>Cảnh báo:</b> Không thể dự báo do dữ liệu không đủ hoặc cá đang không lớn."
            
        self.ax.legend(facecolor='#333', edgecolor='white', labelcolor='white')
        self.figure.tight_layout()
        self.canvas.draw()
        
        self.stats_label.setText(msg)

class MainWindow(QMainWindow):
    def __init__(self, fish_counter):
        super().__init__()
        self.setStyleSheet(MODERN_STYLE)
        try:
            self.fish_counter = fish_counter
            self.video_thread = None
            self.count_history = []
            self.selected_video_path = None
            
            self.init_ui()
            self.load_history()
            self.showMaximized()
            logging.info("MainWindow initialized")
            
            self.showMaximized()
            logging.info("MainWindow initialized")
            
            self.elapsed_time = 0
            self.showing_final_result = False
            self.current_fai_display = 0.0 # Biến giữ giá trị FAI đang hiển thị (để làm hiệu ứng mượt)
        except Exception as e:
            logging.error(f"Error initializing MainWindow: {e}")
            QMessageBox.critical(self, "Error", f"Failed to initialize: {str(e)}")
            sys.exit(1)

    def show_styled_message(self, title, message, icon_type="info"):
        msg = QMessageBox(self)
        msg.setWindowTitle(title)
        msg.setText(message)
        
        if icon_type == "warning":
            msg.setIcon(QMessageBox.Warning)
        elif icon_type == "critical":
            msg.setIcon(QMessageBox.Critical)
        else:
            msg.setIcon(QMessageBox.Information)
            
        msg.setStyleSheet("""
            QMessageBox {
                background-color: #2b2b2b;
                color: #ffffff;
                font-family: 'Segoe UI', sans-serif;
            }
            QLabel {
                color: #ffffff;
                font-size: 14px;
                min-width: 300px;
            }
            QPushButton {
                background-color: #007acc;
                color: white;
                border: none;
                padding: 6px 20px;
                border-radius: 4px;
                font-weight: bold;
                min-width: 80px;
            }
            QPushButton:hover {
                background-color: #0098ff;
            }
            QPushButton:pressed {
                background-color: #005c99;
            }
        """)
        msg.exec_()

    def init_ui(self):
        self.setWindowTitle("Smart Fingerling Tracker")
        self.setGeometry(100, 100, 1400, 900)

        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QHBoxLayout(main_widget)
        main_layout.setSpacing(20)
        main_layout.setContentsMargins(20, 20, 20, 20)

        # --- LEFT PANEL: VIDEO & CONTROLS ---
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        left_layout.setSpacing(15)
        
        # 1. Video Display Area
        video_frame = QFrame()
        video_frame.setStyleSheet("background-color: #000; border-radius: 12px; border: 2px solid #333;")
        video_layout = QVBoxLayout(video_frame)
        video_layout.setContentsMargins(0, 0, 0, 0)
        
        self.camera_label = QLabel("No Video Feed")
        self.camera_label.setAlignment(Qt.AlignCenter)
        self.camera_label.setMinimumSize(800, 600)
        self.camera_label.setStyleSheet("color: #555; font-size: 18px;")
        video_layout.addWidget(self.camera_label)
        left_layout.addWidget(video_frame, stretch=3)

        # 2. Control Bar (Horizontal)
        control_bar = QFrame()
        control_bar.setStyleSheet("background-color: #1e1e1e; border-radius: 8px; padding: 10px;")
        control_layout = QHBoxLayout(control_bar)
        
        self.select_file_btn = QPushButton(" Chọn Video")
        self.select_file_btn.setIcon(QIcon.fromTheme("folder-open"))
        self.select_file_btn.clicked.connect(self.select_video_file)
        control_layout.addWidget(self.select_file_btn)
        
        # --- APP MODE SELECTOR ---
        self.app_mode_combo = QComboBox()
        self.app_mode_combo.addItem("Giao Dịch (Đếm)", "counting")
        self.app_mode_combo.addItem("🛡️ Giám Sát", "monitoring")
        self.app_mode_combo.setStyleSheet("""
            QComboBox {
                background-color: #2d2d2d; 
                color: #ffcc00; 
                border: 1px solid #3d3d3d;
                border-radius: 6px;
                padding: 5px;
                min-width: 180px;
                font-weight: bold;
            }
            QComboBox::drop-down { border: none; }
            QComboBox QAbstractItemView {
                background-color: #2d2d2d;
                color: white;
                selection-background-color: #cc9900;
            }
        """)
        self.app_mode_combo.currentIndexChanged.connect(self.enable_app_mode)
        control_layout.addWidget(self.app_mode_combo)

        # --- FISH PROFILE SELECTOR ---
        self.fish_type_combo = QComboBox()
        self.fish_type_combo.addItems(["Cá thường (Vừa)", "Cá da trơn (Chậm)", "Cá săn mồi (Nhanh)"])
        # Map hiển thị -> key logic
        self.fish_type_combo.setItemData(0, "normal")
        self.fish_type_combo.setItemData(1, "slow")
        self.fish_type_combo.setItemData(2, "fast")
        self.fish_type_combo.setStyleSheet("""
            QComboBox {
                background-color: #2d2d2d; 
                color: #4db8ff; 
                border: 1px solid #3d3d3d;
                border-radius: 6px;
                padding: 5px;
                min-width: 160px;
                font-weight: bold;
            }
            QComboBox::drop-down { border: none; }
            QComboBox QAbstractItemView {
                background-color: #2d2d2d;
                color: white;
                selection-background-color: #007acc;
            }
        """)
        self.fish_type_combo.currentIndexChanged.connect(self.update_fish_behavior)
        control_layout.addWidget(self.fish_type_combo)
        
        self.start_button = QPushButton(" BẮT ĐẦU")
        self.start_button.setObjectName("start_btn")
        self.start_button.clicked.connect(self.start_counting)
        control_layout.addWidget(self.start_button)
        
        self.stop_button = QPushButton(" DỪNG")
        self.stop_button.setObjectName("stop_btn")
        self.stop_button.clicked.connect(self.stop_counting)
        self.stop_button.setEnabled(False)
        control_layout.addWidget(self.stop_button)
        
        self.detail_button = QPushButton(" Xem Chi Tiết")
        self.detail_button.setIcon(QIcon.fromTheme("zoom-in"))
        self.detail_button.clicked.connect(self.show_detail_view)
        self.detail_button.setEnabled(False)
        control_layout.addWidget(self.detail_button)
        
        self.export_button = QPushButton(" Xuất Báo Cáo")
        self.export_button.setIcon(QIcon.fromTheme("document-save"))
        self.export_button.clicked.connect(self.export_report)
        control_layout.addWidget(self.export_button)
        
        self.predict_button = QPushButton(" Dự Báo Tăng Trưởng")
        self.predict_button.setIcon(QIcon.fromTheme("view-refresh")) 
        self.predict_button.clicked.connect(self.show_growth_prediction)
        control_layout.addWidget(self.predict_button)
        
        self.show_graph_btn = QPushButton(" 📈 Xem Biểu Đồ")
        self.show_graph_btn.setIcon(QIcon.fromTheme("utilities-system-monitor"))
        self.show_graph_btn.clicked.connect(self.show_growth_chart_popup)
        control_layout.addWidget(self.show_graph_btn)
        
        left_layout.addWidget(control_bar)
        
        main_layout.addWidget(left_panel, stretch=65)

        # --- RIGHT PANEL: STATS & SETTINGS ---
        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        right_layout.setSpacing(20)

        # 1. Statistics Dashboard (Grid of Cards)
        stats_group = QGroupBox("THÔNG SỐ THỜI GIAN THỰC")
        stats_grid = QGridLayout(stats_group)
        stats_grid.setSpacing(15)
        
        self.card_count = StatCard("SỐ LƯỢNG", "0", " con")
        stats_grid.addWidget(self.card_count, 0, 0)
        
        self.card_biomass = StatCard("TỔNG KHỐI LƯỢNG", "0.0", " g")
        stats_grid.addWidget(self.card_biomass, 0, 1)
        
        self.card_avg_weight = StatCard("TRUNG BÌNH/CON", "0.0", " g")
        stats_grid.addWidget(self.card_avg_weight, 1, 0)
        
        self.card_time = StatCard("THỜI GIAN", "0.0", " s")
        right_layout.addWidget(stats_group)
        
        # --- SMART STOP STATUS (NEW) ---
        self.smart_stop_label = QLabel("Sẵn sàng")
        self.smart_stop_label.setAlignment(Qt.AlignCenter)
        self.smart_stop_label.setStyleSheet("font-weight: bold; font-size: 13pt; color: #555555; margin-top: 10px; margin-bottom: 5px;")
        right_layout.addWidget(self.smart_stop_label)
        
        # Activity Index
        self.activity_label = QLabel("MỨC ĐỘ HOẠT ĐỘNG (FAI)")
        self.activity_label.setAlignment(Qt.AlignCenter)
        self.activity_label.setStyleSheet("font-weight: bold; color: #aaa; margin-top: 10px;")
        right_layout.addWidget(self.activity_label)
        
        self.activity_bar = QProgressBar()
        self.activity_bar.setRange(0, 100)
        self.activity_bar.setValue(0)
        self.activity_bar.setTextVisible(True)
        self.activity_bar.setFormat("%v/100 - Đang đo...")
        self.activity_bar.setFixedHeight(25)
        self.activity_bar.setStyleSheet("""
            QProgressBar {
                border: 2px solid #555;
                border-radius: 5px;
                text-align: center;
                color: white;
                background-color: #222;
            }
            QProgressBar::chunk {
                background-color: #00ff00;
                width: 20px;
            }
        """)
        right_layout.addWidget(self.activity_bar)
        
        # AI Recommendation Label
        self.recommendation_label = QLabel("Đang phân tích...")
        self.recommendation_label.setAlignment(Qt.AlignCenter)
        self.recommendation_label.setStyleSheet("font-style: italic; color: #888; font-size: 11pt; margin-bottom: 10px;")
        self.recommendation_label.setWordWrap(True)
        right_layout.addWidget(self.recommendation_label)

        # 2. Method Selection
        method_group = QGroupBox("PHƯƠNG PHÁP ĐẾM")
        method_layout = QVBoxLayout(method_group)
        
        # self.reid_button = QRadioButton("Deep ReID (Experimental)")
        # self.reid_button.clicked.connect(lambda: self.set_counting_method("reid"))
        # method_layout.addWidget(self.reid_button)
        
        # self.tracking_button = QRadioButton("Object Tracking (Experimental)")
        # self.tracking_button.clicked.connect(lambda: self.set_counting_method("tracking"))
        # method_layout.addWidget(self.tracking_button)
        
        self.statistical_button = QRadioButton("Statistical (95th Percentile )")
        self.statistical_button.setChecked(True)
        self.statistical_button.setStyleSheet("font-weight: bold; color: #00ff00;")
        self.statistical_button.clicked.connect(lambda: self.set_counting_method("statistical"))
        method_layout.addWidget(self.statistical_button)
        
        right_layout.addWidget(method_group)

        # 3. History Table
        history_group = QGroupBox("LỊCH SỬ ĐO")
        history_layout = QVBoxLayout(history_group)
        
        self.history_table = QTableWidget()
        self.history_table.setColumnCount(3)
        self.history_table.setHorizontalHeaderLabels(["Time", "Count", "Biomass (g)"])
        self.history_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.history_table.verticalHeader().setVisible(False)
        history_layout.addWidget(self.history_table)
        
        self.clear_history_button = QPushButton("Xóa Lịch Sử")
        self.clear_history_button.setStyleSheet("background-color: #d32f2f; border: none; margin-top: 5px;")
        self.clear_history_button.clicked.connect(self.clear_history)
        history_layout.addWidget(self.clear_history_button)
        
        right_layout.addWidget(history_group, stretch=1)

        # 4. Mini Graph (REMOVED - Moved to Popup)
        # graph_group = QGroupBox("BIỂU ĐỒ TĂNG TRƯỞNG")
        # right_layout.addWidget(graph_group, stretch=1)
        
        main_layout.addWidget(right_panel, stretch=35)

    def select_video_file(self):
        options = QFileDialog.Options()
        file_name, _ = QFileDialog.getOpenFileName(self, "Chọn Video", "", "Video Files (*.mp4 *.avi *.mkv);;All Files (*)", options=options)
        if file_name:
            self.selected_video_path = file_name
            self.camera_label.setText(f"Sẵn sàng: {os.path.basename(file_name)}")
            self.statusBar().showMessage(f"Đã chọn video: {file_name}")

    def start_counting(self):
        try:
            self.start_button.setEnabled(False)
            self.select_file_btn.setEnabled(False)
            
            if hasattr(self, 'timer') and self.timer.isActive():
                self.timer.stop()
            
            if hasattr(self, 'video_thread') and self.video_thread is not None:
                self.video_thread.stop()
                self.video_thread = None
            
            QApplication.processEvents()
            time.sleep(0.5)
            
            # Use selected video or default
            video_to_use = self.selected_video_path
            
            success = self.fish_counter.start_counting(video_to_use)
            
            if not success:
                QMessageBox.warning(self, "Lỗi", "Không thể mở video. Vui lòng chọn file video hợp lệ.")
                self.start_button.setEnabled(True)
                self.select_file_btn.setEnabled(True)
                return
            
            self.showing_final_result = False
            self.stop_button.setEnabled(True)
            self.detail_button.setEnabled(False)
            
            # self.reid_button.setEnabled(False)
            # self.tracking_button.setEnabled(False)
            self.statistical_button.setEnabled(False)
            
            # --- RESET UI CHO PHIÊN MỚI ---
            self.smart_stop_label.setText("Đang khởi động...")
            self.smart_stop_label.setStyleSheet("font-weight: bold; font-size: 13pt; color: #555555; margin-top: 10px; margin-bottom: 5px;")
            
            self.activity_bar.setValue(0)
            self.activity_bar.setFormat("%v/100 - Đang đo...")
            self.activity_bar.setStyleSheet("QProgressBar { border: 2px solid #555; border-radius: 5px; text-align: center; color: white; background-color: #222; }")
            
            self.recommendation_label.setText(" Đang thu thập dữ liệu...")
            self.recommendation_label.setStyleSheet("font-style: italic; color: #888; font-size: 11pt; margin-bottom: 10px;")
            
            self.card_count.set_value("0")
            self.card_biomass.set_value("0.0")
            self.card_avg_weight.set_value("0.0")
            self.card_time.set_value("0.0")
            
            self.statusBar().showMessage("Đang xử lý...")
            
            self.timer = QTimer()
            self.timer.timeout.connect(self.update_frame)
            self.timer.start(50) # 20 FPS UI update
            
            logging.info("Counting started")
        except Exception as e:
            logging.error(f"Error starting counting: {e}")
            QMessageBox.critical(self, "Error", f"Failed to start: {str(e)}")
            self.start_button.setEnabled(True)
            self.select_file_btn.setEnabled(True)

    def stop_counting(self):
        if self.showing_final_result:
            return

        try:
            self.fish_counter.stop_counting()
            
            self.start_button.setEnabled(True)
            self.select_file_btn.setEnabled(True)
            self.stop_button.setEnabled(False)
            self.detail_button.setEnabled(True)
            
            self.statistical_button.setEnabled(True)
            
            self.statusBar().showMessage("Đã dừng")
            
            if self.video_thread:
                self.video_thread.stop()
                self.video_thread = None
                
            logging.info("Counting stopped")
            
            # Manually trigger finish handling to save results
            # Lấy kết quả cuối cùng từ fish_counter
            final_biomass = getattr(self.fish_counter, 'final_biomass', 0)
            elapsed_time = time.time() - self.fish_counter.start_time
            self.handle_counting_finished(elapsed_time, final_biomass)
            
        except Exception as e:
            logging.error(f"Error stopping counting: {e}")

    def update_frame(self):
        try:
            if self.showing_final_result:
                return
                
            # Kiểm tra xem Backend đã tự động dừng chưa (Smart Stop)
            if not self.fish_counter.is_counting:
                if not self.showing_final_result:
                    # Backend đã dừng nhưng UI chưa chốt -> Chốt ngay
                    # Lấy giá trị cuối cùng vừa tính toán xong
                    elapsed = time.time() - self.fish_counter.start_time
                    bio = getattr(self.fish_counter, 'final_biomass', 0)
                    self.handle_counting_finished(elapsed, bio)
                return
                
            # Lấy 6 giá trị trả về từ process_frame (đã thêm fai và has_dead_fish)
            result = self.fish_counter.process_frame()
            frame, count, elapsed_time, total_biomass, fai, has_dead_fish = result
            
            # Nếu frame None (hết video)
            if frame is None:
                if self.fish_counter.is_counting_finished() and not self.showing_final_result:
                    self.handle_counting_finished(elapsed_time, total_biomass)
                return
                
            self.elapsed_time = elapsed_time
            self.display_image(frame)
            self.update_stats(count, total_biomass, elapsed_time)

            # Update Activity Bar with Smoothing (EMA)
            # Làm mượt chuyển động thanh Bar để tránh giật cục
            alpha = 0.05 # Hệ số làm mượt (0.05 = rất mượt, chậm khoảng 1-2s so với thực tế)
            self.current_fai_display = (self.current_fai_display * (1 - alpha)) + (fai * alpha)
            
            display_val = int(self.current_fai_display)
            self.activity_bar.setValue(display_val)
            
            # Color Coding & Status Text & AI Recommendation
            # 1. Xác định trạng thái FAI (Dùng giá trị đã làm mượt để màu sắc không nhấp nháy)
            if display_val < 20:
                status = "LỜ ĐỜ (Low)"
                color = "#888888" # Grey
                fai_advice = "⚠️ Cảnh báo: Kiểm tra Oxy hoặc Sức khỏe cá"
                advice_color = "#aaaaaa"
            elif display_val < 60:
                status = "BÌNH THƯỜNG (Normal)"
                color = "#00ff00" # Green
                fai_advice = "✅ Trạng thái ổn định"
                advice_color = "#00ff00"
            elif display_val < 80:
                status = "SUNG SỨC (High)"
                color = "#ffaa00" # Orange
                fai_advice = "🍽️ Cá đang đói: Thời điểm tốt để cho ăn"
                advice_color = "#ffaa00"
            else:
                status = "NÁO LOẠN (Frenzy)"
                color = "#ff0000" # Red
                fai_advice = "🛑 Cảnh báo: Dừng cho ăn / Giảm lượng thức ăn"
                advice_color = "#ff5555"

            # 2. Xử lý logic hiển thị SỨC KHỎE (FAI & DEAD FISH) - Label dưới cùng
            # Mặc định lấy theo FAI
            rec_text = fai_advice
            rec_color = advice_color

            # Cập nhật trạng thái thanh FAI (Ưu tiên hiển thị màu sắc cảnh báo)
            if has_dead_fish:
                rec_text = "💀 CẢNH BÁO: Phát hiện cá chết hoặc bất thường! Kiểm tra ngay!"
                rec_color = "#ff00ff" # Magenta
                status = "CẢNH BÁO (Warning)" 
                color = "#ff00ff" # Magenta cho thanh Bar
            
            # Cập nhật Thanh FAI và Label Khuyên dùng
            self.activity_bar.setFormat(f"%v/100 - {status}")
            self.activity_bar.setStyleSheet(f"""
                QProgressBar {{
                    border: 2px solid #555;
                    border-radius: 5px;
                    text-align: center;
                    color: white;
                    background-color: #222;
                }}
                QProgressBar::chunk {{
                    background-color: {color};
                    width: 20px;
                }}
            """)
            self.recommendation_label.setText(f" {rec_text}")
            self.recommendation_label.setStyleSheet(f"font-style: italic; color: {rec_color}; font-size: 11pt; margin-bottom: 10px; font-weight: bold;")

            # 3. Xử lý logic hiển thị TIẾN ĐỘ (SMART STOP) - Label mới ở giữa
            stop_text = ""
            stop_color = "#555555"
            
            if self.fish_counter.app_mode == 'counting':
                 progress = self.fish_counter.stability_progress # 0.0 -> 1.0
                 
                 if progress > 0:
                     percent = int(progress * 100)
                     bars_count = percent // 5
                     p_bar = "▓" * bars_count + "░" * (20 - bars_count)
                     duration_hold = int(progress * self.fish_counter.patience_duration)
                     
                     stop_text = f"⏳ ĐANG CHỐT: {p_bar} {percent}% ({duration_hold}s)"
                     stop_color = "#00ffff" # Cyan
                 else:
                     stop_text = "🔎 Đang tìm đỉnh ổn định... (Chưa chốt)"
                     stop_color = "#aaaaaa"
            else:
                 stop_text = "🛡️ CHẾ ĐỘ GIÁM SÁT (Chạy liên tục)"
                 stop_color = "#00ff00"
            
            self.smart_stop_label.setText(stop_text)
            self.smart_stop_label.setStyleSheet(f"font-weight: bold; font-size: 13pt; color: {stop_color}; margin-top: 10px; margin-bottom: 5px;")
            
        except Exception as e:
            logging.error(f"Error updating frame: {e}")

    def handle_counting_finished(self, elapsed_time, total_biomass):
        self.showing_final_result = True
        # Removed self.stop_counting() to avoid recursion loop
        
        final_count = self.fish_counter.get_final_count()
        final_biomass_stat = getattr(self.fish_counter, 'final_biomass', 0) # Lấy giá trị thống kê 95%
        
        logging.info(f"UI Handling Finish: Count={final_count}, Biomass={final_biomass_stat}")
        
        self.update_stats(final_count, final_biomass_stat, elapsed_time)
        
        # Auto save
        try:
            result = self.fish_counter.save_result(self.elapsed_time)
            if result:
                result['biomass'] = final_biomass_stat
                session = len(self.count_history) + 1
                result['session'] = session
                self.count_history.append(result)
                self.save_history()
                self.update_history_table()
                self.plot_history()
                self.statusBar().showMessage(f"Đã lưu: {final_count} cá")
        except Exception as e:
            logging.error(f"Error auto-saving: {e}")
        
        # Custom styled message box
        msg_text = f"Đã đếm xong!\n\nSố lượng: {final_count} con\nTổng khối lượng: {final_biomass_stat:.1f}g"
        self.show_styled_message("Hoàn Thành", msg_text, "info")
        
        self.detail_button.setEnabled(True)
        
        # --- RE-ENABLE CONTROLS ---
        self.start_button.setEnabled(True)
        self.select_file_btn.setEnabled(True)
        self.stop_button.setEnabled(False)
        self.statistical_button.setEnabled(True)
        
        logging.info("UI unlocked after auto-stop.")

    def update_stats(self, count, biomass, time_val):
        self.card_count.set_value(str(count))
        self.card_biomass.set_value(f"{biomass:.1f}")
        self.card_time.set_value(f"{time_val:.1f}")
        
        avg = biomass / count if count > 0 else 0
        self.card_avg_weight.set_value(f"{avg:.1f}")

    def display_image(self, img):
        try:
            if img is None: return
            
            h, w, c = img.shape
            bytes_per_line = 3 * w
            
            # Convert BGR to RGB
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            q_img = QImage(rgb_img.data, w, h, bytes_per_line, QImage.Format_RGB888)
            
            # Get label size
            label_w = self.camera_label.width()
            label_h = self.camera_label.height()
            
            # Scale image to fit label while maintaining aspect ratio
            scaled_img = q_img.scaled(label_w, label_h, Qt.KeepAspectRatio, Qt.SmoothTransformation)
            
            self.camera_label.setPixmap(QPixmap.fromImage(scaled_img))
        except Exception as e:
            logging.error(f"Error displaying image: {e}")

    def load_history(self):
        try:
            history_path = os.path.join('data', 'outputs', 'counting_history.json')
            if os.path.exists(history_path):
                with open(history_path, 'r') as f:
                    self.count_history = json.load(f)
                self.update_history_table()
                self.plot_history()
        except Exception as e:
            logging.error(f"Error loading history: {e}")

    def plot_history(self):
        # Biểu đồ đã được chuyển sang Popup (GrowthChartDialog) để tối ưu không gian.
        # Hàm này giữ lại để tránh lỗi gọi từ các nơi khác, nhưng không thực thi vẽ nữa.
        pass

    def save_history(self):
        try:
            os.makedirs(os.path.join('data', 'outputs'), exist_ok=True)
            history_path = os.path.join('data', 'outputs', 'counting_history.json')
            with open(history_path, 'w') as f:
                json.dump(self.count_history, f)
        except Exception as e:
            logging.error(f"Error saving history: {e}")

    def update_history_table(self):
        self.history_table.setRowCount(0)
        for result in reversed(self.count_history): # Show newest first
            row = self.history_table.rowCount()
            self.history_table.insertRow(row)
            # Hiển thị đầy đủ ngày tháng năm giờ phút giây
            self.history_table.setItem(row, 0, QTableWidgetItem(result['timestamp']))
            self.history_table.setItem(row, 1, QTableWidgetItem(str(result['count'])))
            biomass = result.get('biomass', 0)
            self.history_table.setItem(row, 2, QTableWidgetItem(f"{biomass:.1f}"))

    def show_detail_view(self):
        try:
            from PyQt5.QtWidgets import QDialog, QFormLayout
            
            dialog = QDialog(self)
            dialog.setWindowTitle("Chi Tiết Phiên Đếm (95th Percentile Analysis)")
            dialog.setMinimumSize(600, 400)
            dialog.setStyleSheet(MODERN_STYLE)
            
            layout = QHBoxLayout(dialog)
            
            # Lấy dữ liệu thô từ fish_counter
            all_counts = self.fish_counter.all_counts
            all_biomass = self.fish_counter.all_biomass
            
            if not all_counts:
                QMessageBox.warning(self, "No Data", "Chưa có dữ liệu phiên đếm.")
                return

            # --- CỘT 1: SỐ LƯỢNG ---
            count_group = QGroupBox("THỐNG KÊ SỐ LƯỢNG")
            count_layout = QFormLayout(count_group)
            
            valid_counts = [c for c in all_counts if c > 0]
            if valid_counts:
                c_min = min(valid_counts)
                c_max = max(valid_counts)
                c_med = np.median(valid_counts)
                c_95 = np.percentile(valid_counts, 95)
                
                count_layout.addRow("Min (Lúc che khuất):", QLabel(f"{c_min}"))
                count_layout.addRow("Max (Lúc nhiễu):", QLabel(f"{c_max}"))
                count_layout.addRow("Median (Trung vị):", QLabel(f"{int(c_med)}"))
                
                lbl_95 = QLabel(f"{int(c_95)}")
                lbl_95.setStyleSheet("font-size: 20px; font-weight: bold; color: #00ff00;")
                count_layout.addRow("95th Percentile (CHỐT):", lbl_95)
                count_layout.addRow("Số mẫu (Frames):", QLabel(f"{len(valid_counts)}"))
            
            layout.addWidget(count_group)
            
            # --- CỘT 2: SINH KHỐI ---
            bio_title = "THỐNG KÊ SINH KHỐI"
            
            # Logic Fallback: Nếu dữ liệu lọc sạch bị rỗng (do FAI quá chặt), dùng dữ liệu thô
            if not self.fish_counter.all_biomass and hasattr(self.fish_counter, 'all_biomass_raw') and self.fish_counter.all_biomass_raw:
                target_biomass_list = self.fish_counter.all_biomass_raw
                bio_title += " (RAW DATA - UNFILTERED)"
                is_fallback = True
            else:
                target_biomass_list = self.fish_counter.all_biomass
                is_fallback = False
                
            bio_group = QGroupBox(bio_title)
            bio_layout = QFormLayout(bio_group)
            
            # if is_fallback:
            #     warn_label = QLabel("⚠️ FAI Filter too strict. Using raw data.")
            #     warn_label.setStyleSheet("color: orange; font-style: italic;")
            #     bio_layout.addRow(warn_label)
            
            valid_bio = [b for b in target_biomass_list if b > 0]
            if valid_bio:
                b_min = min(valid_bio)
                b_max = max(valid_bio)
                b_med = np.median(valid_bio)
                b_95 = np.percentile(valid_bio, 95)
                
                bio_layout.addRow("Min:", QLabel(f"{b_min:.1f} g"))
                bio_layout.addRow("Max:", QLabel(f"{b_max:.1f} g"))
                bio_layout.addRow("Median:", QLabel(f"{b_med:.1f} g"))
                
                lbl_b95 = QLabel(f"{b_95:.1f} g")
                lbl_b95.setStyleSheet("font-size: 20px; font-weight: bold; color: #00ff00;")
                bio_layout.addRow("95th Percentile (CHỐT):", lbl_b95)
            
            layout.addWidget(bio_group)
            
            dialog.exec_()
            
        except Exception as e:
            logging.error(f"Error showing detail view: {e}")
            self.show_styled_message("Error", str(e), "critical")

    def export_report(self):
        try:
            if not self.count_history:
                self.show_styled_message("No Data", "Không có lịch sử để xuất.", "warning")
                return
                
            options = QFileDialog.Options()
            file_name, _ = QFileDialog.getSaveFileName(self, "Xuất Báo Cáo", "fish_report.csv", "CSV Files (*.csv);;All Files (*)", options=options)
            
            if file_name:
                import csv
                with open(file_name, 'w', newline='', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    writer.writerow(["Session", "Timestamp", "Count (95th)", "Biomass (g)", "Duration (s)", "Method"])
                    
                    for row in self.count_history:
                        writer.writerow([
                            row.get('session', ''),
                            row.get('timestamp', ''),
                            row.get('count', ''),
                            f"{row.get('biomass', 0):.2f}",
                            f"{row.get('duration', 0):.1f}",
                            row.get('method', '')
                        ])
                
                self.show_styled_message("Thành công", f"Đã xuất báo cáo ra: {file_name}", "info")
        except Exception as e:
            logging.error(f"Error exporting report: {e}")
            self.show_styled_message("Error", str(e), "critical")

    def show_growth_prediction(self):
        try:
            if not self.count_history or len(self.count_history) < 2:
                self.show_styled_message("Thiếu Dữ Liệu", "Cần ít nhất 2 phiên đo đạc trong lịch sử để dự báo xu hướng.", "warning")
                return

            dialog = GrowthPredictionDialog(self.count_history, self)
            dialog.exec_()
                
        except Exception as e:
            logging.error(f"Error predicting growth: {e}")
            self.show_styled_message("Error", str(e), "critical")

    def save_result(self):
        # Manual save if needed (auto-save is already implemented)
        QMessageBox.information(self, "Info", "Kết quả đã được tự động lưu.")

    def set_counting_method(self, method):
        self.fish_counter.set_counting_method(method)

    def clear_history(self):
        reply = QMessageBox.question(self, 'Xác nhận', "Xóa toàn bộ lịch sử?", QMessageBox.Yes | QMessageBox.No)
        if reply == QMessageBox.Yes:
            self.count_history = []
            self.save_history()
            self.update_history_table()
            self.plot_history()

    def closeEvent(self, event):
        if hasattr(self, 'timer'): self.timer.stop()
        if self.fish_counter.is_counting: self.fish_counter.stop_counting()
        event.accept()

    def update_fish_behavior(self, index):
        """Cập nhật profile hành vi cá khi người dùng thay đổi ComboBox"""
        try:
            profile_key = self.fish_type_combo.itemData(index)
            if self.fish_counter:
                self.fish_counter.set_fish_behavior(profile_key)
                
                # Cập nhật giao diện để báo hiệu thay đổi
                self.activity_bar.setFormat(f"%v/100 - {profile_key.upper()}")
                
                # Hiển thị thông báo nhỏ trên thanh trạng thái hoặc log
                logging.info(f"UI Switch: Behavior set to {profile_key}")
        except Exception as e:
            logging.error(f"Error updating fish behavior from UI: {e}")

    def enable_app_mode(self, index):
        """Chuyển đổi chế độ App: Trading (Đếm) vs Monitoring (Giám sát)"""
        try:
            mode_key = self.app_mode_combo.itemData(index)
            if self.fish_counter:
                self.fish_counter.set_app_mode(mode_key)
                
                # Cập nhật giao diện feedback
                if mode_key == 'counting':
                    msg = "⚖️ CHẾ ĐỘ GIAO DỊCH: Tự động dừng khi đếm xong (Smart Stop)."
                else:
                    msg = "🛡️ CHẾ ĐỘ GIÁM SÁT: Chạy liên tục - Cảnh báo cá chết - Theo dõi FAI 24/7."
                
                self.statusBar().showMessage(msg, 5000)
                logging.info(f"UI Switch: App Mode set to {mode_key}")
                
        except Exception as e:
            logging.error(f"Error updating app mode from UI: {e}")

    def show_growth_chart_popup(self):
        if not self.count_history:
            self.show_styled_message("Thông báo", "Chưa có dữ liệu lịch sử để vẽ biểu đồ.", "warning")
            return
        dialog = GrowthChartDialog(self.count_history, self)
        dialog.exec_()

class GrowthChartDialog(QDialog):
    def __init__(self, history_data, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Biểu Đồ Tăng Trưởng (Growth Chart)")
        self.setGeometry(200, 200, 900, 600)
        self.setStyleSheet("background-color: #1e1e1e; color: white;")
        layout = QVBoxLayout(self)
        
        self.figure, self.ax = plt.subplots(figsize=(10, 6))
        self.figure.patch.set_facecolor('#1e1e1e')
        self.ax.set_facecolor('#1e1e1e')
        self.ax.tick_params(colors='white', labelsize=10)
        self.ax.set_title("Biểu đồ Sinh Khối & Số Lượng theo Thời Gian", color='white', fontsize=14, pad=20)
        self.ax.set_xlabel("Thời gian đo", color='white', fontsize=12)
        self.ax.set_ylabel("Giá trị", color='white', fontsize=12)
        self.ax.grid(color='#444', linestyle='--', linewidth=0.5)
        for spine in self.ax.spines.values():
            spine.set_color('#555')

        # Vẽ biểu đồ
        if history_data:
            import matplotlib.dates as mdates
            from datetime import datetime

            dates = []
            counts = []
            biomass = []
            
            for h in history_data:
                try:
                    # Chuyển đổi String -> Datetime để Matplotlib tự xử lý giãn cách
                    dt = datetime.strptime(h.get('timestamp', ''), "%Y-%m-%d %H:%M:%S")
                    dates.append(dt)
                    counts.append(h.get('count', 0))
                    # Fallback biomass nếu thiếu
                    b = h.get('biomass', 0)
                    biomass.append(b if b is not None else 0)
                except Exception:
                    continue
            
            if not dates: return

            # Trục 1: Số lượng (Cột - Bar Plot hoặc Line đều được, dùng Line cho rõ xu hướng)
            color1 = '#00aaff'
            line1 = self.ax.plot(dates, counts, color=color1, marker='o', label='Số lượng (con)', linewidth=2)
            self.ax.set_ylabel('Số lượng (con)', color=color1)
            self.ax.tick_params(axis='y', labelcolor=color1)

            # Trục 2: Sinh khối (Đường) - Twinx
            ax2 = self.ax.twinx()
            color2 = '#ffaa00'
            line2 = ax2.plot(dates, biomass, color=color2, marker='s', linestyle='--', label='Sinh khối (g)', linewidth=2)
            ax2.set_ylabel('Sinh khối (g)', color=color2)
            ax2.tick_params(axis='y', labelcolor=color2)
            ax2.spines['top'].set_color('none')
            ax2.spines['bottom'].set_color('none')
            ax2.spines['left'].set_color('none')
            ax2.spines['right'].set_color('none')
            ax2.tick_params(colors='white') # Đảm bảo trục phải cũng màu trắng
            
            # Cấu hình trục thời gian (X-Axis) cho đẹp mắt
            # Format: Ngày/Tháng (xuống dòng) Giờ:Phút -> Gọn gàng
            myFmt = mdates.DateFormatter('%d/%m\n%H:%M')
            self.ax.xaxis.set_major_formatter(myFmt)
            
            # Tự động chọn khoảng cách tick hợp lý (không bị chồng chéo)
            self.ax.xaxis.set_major_locator(mdates.AutoDateLocator())
            
            # Xoay nhẹ để dễ đọc
            self.figure.autofmt_xdate(rotation=0, ha='center') 
            
            # Legend
            lines = line1 + line2
            labels = [l.get_label() for l in lines]
            self.ax.legend(lines, labels, loc='upper left', facecolor='#333', edgecolor='white', labelcolor='white')
            
            self.figure.tight_layout()

        self.canvas = FigureCanvas(self.figure)
        layout.addWidget(self.canvas)
        
        btn_layout = QHBoxLayout()
        export_btn = QPushButton("Lưu Ảnh")
        export_btn.clicked.connect(self.save_chart)
        export_btn.setStyleSheet("background-color: #007acc; color: white; padding: 8px; border-radius: 4px;")
        
        close_btn = QPushButton("Đóng")
        close_btn.clicked.connect(self.close)
        close_btn.setStyleSheet("background-color: #555; color: white; padding: 8px; border-radius: 4px;")
        
        btn_layout.addStretch()
        btn_layout.addWidget(export_btn)
        btn_layout.addWidget(close_btn)
        layout.addLayout(btn_layout)

    def save_chart(self):
        filename, _ = QFileDialog.getSaveFileName(self, "Lưu Biểu Đồ", "", "PNG Image (*.png);;JPEG Image (*.jpg)")
        if filename:
            self.figure.savefig(filename)