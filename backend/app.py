from flask import Flask
from flask_cors import CORS
import os
import keras

# --- KERAS 3 COMPATIBILITY PATCH ---
# Fixes 'Unrecognized keyword arguments passed to Dense: quantization_config'
from keras.layers import Dense
original_dense_init = Dense.__init__
def patched_dense_init(self, *args, **kwargs):
    kwargs.pop('quantization_config', None)
    return original_dense_init(self, *args, **kwargs)
Dense.__init__ = patched_dense_init
# ------------------------------------

app = Flask(__name__)
CORS(app)

from config import *
for d in [TEMP_UPLOAD_DIR, PREDICTIONS_DIR, HEATMAPS_DIR]:
    os.makedirs(d, exist_ok=True)



from config import (
    EFFICIENTNET_MODEL_PATH,
    SVM_MODEL_PATH,
    SCALER_PATH,
    LABEL_ENCODER_PATH,
    CLASS_NAMES_PATH
)


from routes.predict_routes import predict_bp
app.register_blueprint(predict_bp)

@app.route("/health")
def health():
    return {
        "status": "ok",
        "message": "DevAlaya backend running"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)