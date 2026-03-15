
import io
import sys
import os
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from contextlib import asynccontextmanager
from PIL import Image
from typing import List
import logging

# Ensure src.core is importable
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from src.core.fish_counter import FishCounter

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AquatradeAI-Service")

# Global variables
fish_counter = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load model on startup, clean up on shutdown
    """
    global fish_counter
    logger.info("Initializing FishCounter Model...")
    try:
        # Initialize FishCounter from existing class
        # Ideally, we should modify FishCounter to support single image prediction without initializing full video capture logic
        # For now, we utilize the model loading part
        fish_counter = FishCounter(model_path="models/best.pt")
        logger.info("FishCounter Model loaded successfully!")
    except Exception as e:
        logger.error(f"Failed to load FishCounter Model: {e}")
        sys.exit(1)
    
    yield
    
    # Cleanup if needed
    logger.info("Shutting down AI Service...")

app = FastAPI(title="AquaTrade AI Service", lifespan=lifespan)

def process_single_image(image_bytes):
    """
    Helper function to process a single image using FishCounter's logic
    """
    try:
        # Convert bytes to numpy array (OpenCV format)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise ValueError("Could not decode image")
            
        # Enhance frame (using existing logic)
        enhanced_frame = fish_counter.enhance_frame(frame)
        
        # Run inference
        results = fish_counter.model(enhanced_frame)
        
        # Process detections
        # Note: process_detections returns (detections, features)
        detections, _ = fish_counter.process_detections(results, frame)
        
        # Calculate count and biomass
        count = len(detections)
        biomass = 0.0
        
        details = []
        for det in detections:
            # det format: [bbox, conf, cls, mask_area]
            if len(det) >= 4:
                bbox, conf, cls, mask_area = det
                weight = fish_counter.calculate_biomass(mask_area, cls)
                biomass += weight
                details.append({
                    "box": bbox.tolist(),
                    "confidence": float(conf),
                    "class_id": int(cls),
                    "mask_area": float(mask_area),
                    "estimated_weight": float(weight)
                })
        
        return {
            "count": count,
            "total_biomass": biomass,
            "details": details
        }
        
    except Exception as e:
        logger.error(f"Error processing single image: {e}")
        raise e

@app.get("/")
def read_root():
    return {"status": "ok", "service": "AquaTrade AI Vision Service"}

@app.post("/predict/snapshot")
async def predict_snapshot(file: UploadFile = File(...)):
    """
    Endpoint for single image prediction (Snapshot)
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        contents = await file.read()
        result = process_single_image(contents)
        return {
            "status": "success",
            "filename": file.filename,
            "data": result
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Run API server
    uvicorn.run(app, host="0.0.0.0", port=8000)
