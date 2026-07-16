import os
import uuid
import logging

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app import limiter

# Configure logging to logs/app.log
LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")
os.makedirs(LOGS_DIR, exist_ok=True)
log_filepath = os.path.join(LOGS_DIR, "app.log")

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)
if not logger.handlers:
    file_handler = logging.FileHandler(log_filepath)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)


from config import (
    TEMP_UPLOAD_DIR,
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE_MB
)

from services.predictor import predict_temple


# ----------------------------------------
# Blueprint setup
# ----------------------------------------
predict_bp = Blueprint(
    "predict",
    __name__
)


# ----------------------------------------
# Allowed file checker
# ----------------------------------------
def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# ----------------------------------------
# Predict Route
# POST /predict
# ----------------------------------------
@predict_bp.route("/predict", methods=["POST"])
@limiter.limit("10 per minute")
def predict():
    try:
        # Check file exists
        if "image" not in request.files:
            return jsonify({
                "success": False,
                "message": "No image file uploaded"
            }), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({
                "success": False,
                "message": "No file selected"
            }), 400

        # Validate extension
        if not allowed_file(file.filename):
            return jsonify({
                "success": False,
                "message": "Invalid file type"
            }), 400

        # Generate unique filename
        ext = file.filename.rsplit(".", 1)[1].lower()

        unique_filename = (
            str(uuid.uuid4()) + "." + ext
        )

        filepath = os.path.join(
            TEMP_UPLOAD_DIR,
            secure_filename(unique_filename)
        )

        os.makedirs(
            TEMP_UPLOAD_DIR,
            exist_ok=True
        )

        # Validate request Content-Length before saving to disk
        content_length = request.content_length
        if content_length is None:
            return jsonify({
                "success": False,
                "message": "Missing Content-Length header"
            }), 400

        if content_length > MAX_FILE_SIZE_MB * 1024 * 1024:
            return jsonify({
                "success": False,
                "message": f"File exceeds {MAX_FILE_SIZE_MB}MB limit"
            }), 400

        file.save(filepath)

        try:
            # -----------------------------
            # Prediction
            # -----------------------------
            prediction_result = predict_temple(filepath)

            if "error" in prediction_result:
                return jsonify({
                    "success": False,
                    "message": f"Prediction Engine Error: {prediction_result['error']}"
                }), 500


            return jsonify({
                "success": True,
                "prediction": prediction_result.get("final_prediction", "Error"),
                "confidence": prediction_result.get("confidence", 0),
                "cnn_result": prediction_result.get("cnn_result", {}),
                "svm_result": prediction_result.get("svm_result", {}),
                "uncertain": prediction_result.get("confidence", 0) < 0.55,
                "class_probabilities": prediction_result.get("class_probabilities")
            })
        finally:
            if os.path.exists(filepath):
                os.remove(filepath)


    except Exception as e:
        logger.exception("An exception occurred in predict route:")
        return jsonify({
            "success": False,
            "message": "An internal error occurred. Please try again."
        }), 500