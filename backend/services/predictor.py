import os
import json
import cv2
import numpy as np
import tensorflow as tf
from PIL import Image

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
model = None
class_names = None

# ----------------------------
# Load CNN model lazily
# ----------------------------
def load_all_models():
    global model, class_names

    try:
        if model is None:
            print("[DevAlaya] Loading CNN Engine...")
            model = tf.keras.models.load_model(EFFICIENTNET_MODEL_PATH, compile=False)
        
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
    try:
        img_pil = Image.open(image_path).convert("RGB")
    except Exception as e:
        raise ValueError(f"Invalid image file: {e}")

    # Calculate scaling ratio to fit within 224x224 while preserving original aspect ratio
    w, h = img_pil.size
    ratio = min(224 / w, 224 / h)
    new_w = int(w * ratio)
    new_h = int(h * ratio)

    # Resize using Image.resize() with LANCZOS resampling
    resized_img = img_pil.resize((new_w, new_h), Image.LANCZOS)

    # Create new black 224x224 background
    canvas = Image.new("RGB", (224, 224), (0, 0, 0))

    # Paste the resized image centered on the black canvas
    paste_x = (224 - new_w) // 2
    paste_y = (224 - new_h) // 2
    canvas.paste(resized_img, (paste_x, paste_y))

    # Convert to numpy array and pass to preprocess_input as before
    img = np.array(canvas, dtype=np.float32)
    original = np.array(canvas, dtype=np.uint8)

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
        preds = model.predict(processed_img, verbose=0)
        all_probs = {class_names[i]: round(float(preds[0][i]) * 100, 1) 
                     for i in range(len(class_names))}
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
            "uncertain": is_unknown,
            "class_probabilities": all_probs
        }

    except Exception as e:
        return {"error": str(e)}