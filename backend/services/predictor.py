import os
import json
import cv2
import numpy as np
import tensorflow as tf

from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input

from config import (
    EFFICIENTNET_MODEL_PATH,
    CLASS_NAMES_PATH,
    IMG_SIZE,
    CONFIDENCE_THRESHOLD
)

# ----------------------------
# Global model variables
# ----------------------------
cnn_model = None
class_names = None

# ----------------------------
# Load CNN model lazily
# ----------------------------
def load_all_models():
    global cnn_model, class_names

    try:
        if cnn_model is None:
            print("[DevAlaya] Loading CNN Engine...")
            cnn_model = load_model(
                EFFICIENTNET_MODEL_PATH,
                compile=False,
                safe_mode=False
            )
        
        if class_names is None:
            with open(CLASS_NAMES_PATH, "r") as f:
                class_names = json.load(f)
            print("[DevAlaya] CNN Engine Ready.")

    except Exception as e:
        print(f"Error loading model: {e}")
        raise e

# ----------------------------
# Image preprocessing
# ----------------------------
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Invalid image file")

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, IMG_SIZE)
    original = img.copy()

    img = np.array(img, dtype=np.float32)
    img = preprocess_input(img)
    img = np.expand_dims(img, axis=0)

    return img, original

# ----------------------------
# Pure CNN prediction
# ----------------------------
def predict_temple(image_path):
    try:
        load_all_models()
        processed_img, original_img = preprocess_image(image_path)

        # CNN prediction
        preds = cnn_model.predict(processed_img, verbose=0)
        predicted_idx = np.argmax(preds)
        confidence = float(np.max(preds))
        predicted_class = class_names[predicted_idx]

        # STRICT OOD CHECK
        is_unknown = confidence < 0.70
        
        # Initial label
        label = "Unknown / Non-Temple" if is_unknown else predicted_class
        
        # FINAL MAPPING (Vesara -> Kalinga)
        if label.lower() == "vesara":
            label = "Kalinga"

        return {
            "final_prediction": label,
            "confidence": confidence,
            "cnn_result": {
                "prediction": label,
                "confidence": confidence
            },
            "svm_result": None,
            "uncertain": is_unknown
        }

    except Exception as e:
        return {"error": str(e)}