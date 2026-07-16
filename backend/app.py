import sys
if __name__ == "__main__":
    # Alias 'app' in sys.modules to prevent double-importing app.py when run directly
    sys.modules['app'] = sys.modules['__main__']

from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import keras


app = Flask(__name__)
CORS(app)

limiter = Limiter(get_remote_address, app=app, 
                  default_limits=["200 per day", "50 per hour"])

from config import *
for d in [TEMP_UPLOAD_DIR, PREDICTIONS_DIR, HEATMAPS_DIR]:
    os.makedirs(d, exist_ok=True)


from config import (
    EFFICIENTNET_MODEL_PATH,
    CLASS_NAMES_PATH
)


from routes.predict_routes import predict_bp
from routes.explain_routes import explain_bp

app.register_blueprint(predict_bp)
app.register_blueprint(explain_bp)

from services.predictor import load_all_models as load_cnn
from services.gradcam import load_all_models as load_gradcam

import time
import sys
import traceback

try:
    with app.app_context():
        start_time = time.time()
        print("[DevAlaya] Pre-loading models on startup...", flush=True)
        load_cnn()
        load_gradcam(
            EFFICIENTNET_MODEL_PATH,
            CLASS_NAMES_PATH
        )
        elapsed_time = time.time() - start_time
        print(f"[DevAlaya] All models ready. Load duration: {elapsed_time:.2f} seconds", flush=True)
except Exception as e:
    print(f"[FATAL ENGINE ERROR] Failed to eager load models during startup: {e}", file=sys.stderr, flush=True)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)

@app.route("/health")
def health():
    return {
        "status": "ok",
        "message": "DevAlaya backend running"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)