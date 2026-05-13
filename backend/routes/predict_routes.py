import os
import uuid

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

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

        file.save(filepath)

        # File size validation
        file_size_mb = os.path.getsize(
            filepath
        ) / (1024 * 1024)

        if file_size_mb > MAX_FILE_SIZE_MB:
            os.remove(filepath)

            return jsonify({
                "success": False,
                "message": f"File exceeds {MAX_FILE_SIZE_MB}MB limit"
            }), 400

        # -----------------------------
        # Prediction
        # -----------------------------
        prediction_result = predict_temple(filepath)

        if "error" in prediction_result:
            return jsonify({
                "success": False,
                "message": f"Prediction Engine Error: {prediction_result['error']}"
            }), 500

        # Remove temp file after processing
        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({
            "success": True,
            "prediction": prediction_result.get("final_prediction", "Error"),
            "confidence": prediction_result.get("confidence", 0),
            "cnn_result": prediction_result.get("cnn_result", {}),
            "svm_result": prediction_result.get("svm_result", {}),
            "uncertain": prediction_result.get("confidence", 0) < 0.55
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500