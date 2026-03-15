from ultralytics import YOLO
import cv2

model = YOLO("best.pt")  

cap = cv2.VideoCapture("1.mp4")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break  

    results = model(frame)

    total_objects = len(results[0].boxes)

    for box in results[0].boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        class_id = int(box.cls)  
        conf = box.conf.item() 

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        label = f"Class {class_id}: {conf:.2f}"
        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    cv2.putText(frame, f"Total Objects: {total_objects}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    cv2.imshow("Dem ca", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
