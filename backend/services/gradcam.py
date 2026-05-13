import os
import io
import json
import base64
import numpy as np
import cv2
import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import tensorflow as tf
import joblib

from PIL import Image
from lime import lime_image
from skimage.segmentation import mark_boundaries
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.applications.efficientnet import preprocess_input

from config import (
    IMG_SIZE,
    GRADCAM_LAYER,
    CONFIDENCE_THRESHOLD,
    HEATMAPS_DIR,
    EFFICIENTNET_MODEL_PATH,
    SVM_MODEL_PATH,
    SCALER_PATH,
    LABEL_ENCODER_PATH,
    CLASS_NAMES_PATH
)

# ---------------------------------------------------
# Global model variables (loaded once during startup)
# ---------------------------------------------------
_full_model = None
_feature_extractor = None
_gradcam_model = None
_svm_model = None
_scaler = None
_label_encoder = None
_class_names = None


# ---------------------------------------------------
# Load all models
# Called once in app.py startup
# ---------------------------------------------------
def load_all_models(
    model_path,
    svm_path,
    scaler_path,
    label_encoder_path,
    class_names_path
):
    global _full_model
    global _feature_extractor
    global _gradcam_model
    global _svm_model
    global _scaler
    global _label_encoder
    global _class_names

    print("[DevAlaya] Loading models...")

    # CNN model
    _full_model = load_model(
        model_path,
        compile=False,
        safe_mode=False
    )

    # Feature extractor → second last layer
    _feature_extractor = Model(
        inputs=_full_model.input,
        outputs=_full_model.layers[-2].output
    )

    # GradCAM model
    last_conv_layer = _full_model.get_layer(GRADCAM_LAYER)

    _gradcam_model = Model(
        inputs=_full_model.input,
        outputs=[last_conv_layer.output, _full_model.output]
    )

    # SVM pipeline
    _svm_model = joblib.load(svm_path)
    _scaler = joblib.load(scaler_path)
    _label_encoder = joblib.load(label_encoder_path)

    with open(class_names_path, "r") as f:
        _class_names = json.load(f)

    print("[DevAlaya] Models loaded successfully")
    print("Classes:", _class_names)


# ---------------------------------------------------
# Preprocess image
# ---------------------------------------------------
def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize(IMG_SIZE)

    display_img = np.array(img)

    img_array = np.expand_dims(display_img.astype(np.float32), axis=0)
    processed_img = preprocess_input(img_array)

    return processed_img, display_img


# ---------------------------------------------------
# GradCAM heatmap generation
# ---------------------------------------------------
def generate_gradcam(processed_img, class_index):
    img_tensor = tf.cast(processed_img, tf.float32)

    with tf.GradientTape() as tape:
        conv_outputs, predictions = _gradcam_model(img_tensor)
        loss = predictions[:, int(class_index)]

    grads = tape.gradient(loss, conv_outputs)

    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]

    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0)

    if tf.reduce_max(heatmap) != 0:
        heatmap /= tf.reduce_max(heatmap)

    heatmap = heatmap.numpy()
    heatmap = cv2.resize(heatmap, IMG_SIZE)

    return heatmap


# ---------------------------------------------------
# Overlay GradCAM
# ---------------------------------------------------
def overlay_gradcam(display_img, heatmap):
    heatmap = np.uint8(255 * heatmap)

    colored_heatmap = cv2.applyColorMap(
        heatmap,
        cv2.COLORMAP_JET
    )

    colored_heatmap = cv2.cvtColor(
        colored_heatmap,
        cv2.COLOR_BGR2RGB
    )

    overlay = cv2.addWeighted(
        display_img,
        0.6,
        colored_heatmap,
        0.4,
        0
    )

    return overlay


# ---------------------------------------------------
# LIME explanation
# ---------------------------------------------------
def generate_lime(display_img):
    def predict_fn(images):
        batch = preprocess_input(images.astype(np.float32))

        features = _feature_extractor.predict(
            batch,
            verbose=0
        )

        scaled_features = _scaler.transform(features)

        probs = _svm_model.predict_proba(
            scaled_features
        )

        return probs

    explainer = lime_image.LimeImageExplainer()

    explanation = explainer.explain_instance(
        display_img,
        predict_fn,
        top_labels=3,
        num_samples=300
    )

    return explanation


# ---------------------------------------------------
# Overlay LIME
# ---------------------------------------------------
def overlay_lime(display_img, explanation, class_index):
    temp, mask = explanation.get_image_and_mask(
        class_index,
        positive_only=True,
        num_features=8,
        hide_rest=False
    )

    lime_output = mark_boundaries(
        temp / 255.0,
        mask
    )

    lime_output = (lime_output * 255).astype(np.uint8)

    return lime_output


# ---------------------------------------------------
# Convert image → base64
# ---------------------------------------------------
def image_to_base64(img_array):
    img = Image.fromarray(img_array)

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")

    encoded = base64.b64encode(
        buffer.getvalue()
    ).decode()

    return encoded


# ---------------------------------------------------
# Save heatmaps
# ---------------------------------------------------
def save_heatmaps(
    gradcam_img,
    lime_img,
    filename
):
    os.makedirs(
        HEATMAPS_DIR,
        exist_ok=True
    )

    gradcam_path = os.path.join(
        HEATMAPS_DIR,
        f"{filename}_gradcam.png"
    )

    lime_path = os.path.join(
        HEATMAPS_DIR,
        f"{filename}_lime.png"
    )

    Image.fromarray(
        gradcam_img
    ).save(gradcam_path)

    Image.fromarray(
        lime_img
    ).save(lime_path)

    return gradcam_path, lime_path


# ---------------------------------------------------
# Main explanation pipeline
# ---------------------------------------------------
def explain_prediction(
    image_path,
    filename="prediction"
):
    # Ensure models are loaded
    if _feature_extractor is None:
        load_all_models(
            EFFICIENTNET_MODEL_PATH,
            SVM_MODEL_PATH,
            SCALER_PATH,
            LABEL_ENCODER_PATH,
            CLASS_NAMES_PATH
        )

    processed_img, display_img = preprocess_image(
        image_path
    )

    # Feature extraction
    features = _feature_extractor.predict(
        processed_img,
        verbose=0
    )

    scaled_features = _scaler.transform(
        features
    )

    probs = _svm_model.predict_proba(
        scaled_features
    )[0]

    class_index = np.argmax(probs)

    predicted_class = _class_names[class_index]
    confidence = float(
        probs[class_index]
    )

    uncertain = confidence < CONFIDENCE_THRESHOLD

    # GradCAM
    heatmap = generate_gradcam(
        processed_img,
        class_index
    )

    gradcam_img = overlay_gradcam(
        display_img,
        heatmap
    )

    # LIME
    explanation = generate_lime(
        display_img
    )

    lime_img = overlay_lime(
        display_img,
        explanation,
        class_index
    )

    # Save files
    gradcam_path, lime_path = save_heatmaps(
        gradcam_img,
        lime_img,
        filename
    )

    return {
        "prediction": predicted_class,
        "confidence": confidence,
        "uncertain": uncertain,
        "gradcam_base64": image_to_base64(
            gradcam_img
        ),
        "lime_base64": image_to_base64(
            lime_img
        ),
        "gradcam_path": gradcam_path,
        "lime_path": lime_path
    }