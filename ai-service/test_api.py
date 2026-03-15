
import requests
import cv2
import numpy as np
import io

def test_prediction():
    # 1. Create a dummy image
    img = np.zeros((640, 640, 3), dtype=np.uint8)
    # Draw a "fish" (white rectangle)
    cv2.rectangle(img, (100, 100), (200, 150), (255, 255, 255), -1)
    
    # Encode to jpg
    _, img_encoded = cv2.imencode('.jpg', img)
    img_bytes = io.BytesIO(img_encoded.tobytes())
    
    # 2. Send request
    url = "http://localhost:8000/predict/snapshot"
    files = {"file": ("test.jpg", img_bytes, "image/jpeg")}
    
    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, files=files)
        
        # 3. Check response
        if response.status_code == 200:
            print("SUCCESS! API responded with 200 OK")
            print("Response:", response.json())
        else:
            print(f"FAILED! API responded with {response.status_code}")
            print("Body:", response.text)
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to API. Is the server running?")

if __name__ == "__main__":
    test_prediction()
