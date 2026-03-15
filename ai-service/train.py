from ultralytics import YOLO
import argparse

def train_yolo_seg(data_path, model_size='n', epochs=50, img_size=640, batch_size=16, weights=None):

    if weights:
        model_name = weights
        print(f"Tiếp tục training từ model: {model_name}")
    else:
        model_name = f"yolov8{model_size}-seg.pt"
        print(f"Training mới từ model: {model_name}")
        
    model = YOLO(model_name) 
    
    model.train(data=data_path, epochs=epochs, imgsz=img_size, batch=batch_size)
    print("\nTraining hoàn tất! Kiểm tra kết quả tại thư mục 'runs/segment/train/'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=str, required=True, help="Đường dẫn đến dataset.yaml")
    parser.add_argument("--size", type=str, default="n", choices=["n", "s", "m", "l", "x"], help="Kích thước mô hình (n, s, m, l, x)")
    parser.add_argument("--epochs", type=int, default=50, help="Số epochs để train")
    parser.add_argument("--imgsz", type=int, default=640, help="Kích thước ảnh đầu vào")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--weights", type=str, default=None, help="Đường dẫn model để fine-tune (ví dụ: best.pt)")
    
    args = parser.parse_args()
    train_yolo_seg(args.data, args.size, args.epochs, args.imgsz, args.batch, args.weights)
