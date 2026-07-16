import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
STATIC_DIR = os.path.join(BASE_DIR, "static")

EFFICIENTNET_MODEL_PATH = os.path.join(MODELS_DIR, "devalaya_final_model.keras")
CLASS_NAMES_PATH = os.path.join(MODELS_DIR, "class_names.json")

TEMP_UPLOAD_DIR = os.path.join(UPLOADS_DIR, "temp")
PREDICTIONS_DIR = os.path.join(UPLOADS_DIR, "predictions")
HEATMAPS_DIR = os.path.join(STATIC_DIR, "heatmaps")

MAX_FILE_SIZE_MB = 10
CONFIDENCE_THRESHOLD = 0.85
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
IMG_SIZE = (224,224)
GRADCAM_LAYER = "top_activation"