# 🏛️ DevAlaya: Digital Preservation & AI Analysis of Indian Temple Architecture
> Classify and explore Indian Temple Architecture using Deep Learning and Explainable AI.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Keras](https://img.shields.io/badge/Keras-3.12-D00000?style=for-the-badge&logo=keras&logoColor=white)](https://keras.io/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> 🌐 **Live Demo:** Coming Soon — deploying to Vercel + Render  
> 🎓 **Author:** Prajna Shetty — RNS Institute of Technology, Bengaluru (B.E. CSE, 2028)  
> 📦 **Backend:** Dockerized Flask + Gunicorn  

---

## What is DevAalaya?

DevAalaya (*Abode of the Divine*) is a full-stack heritage platform that classifies Indian temple architecture styles from uploaded images using a fine-tuned EfficientNetB0 CNN. It explains its predictions visually using GradCAM and LIME heatmaps, and lets users explore temples through an interactive 3D virtual museum and a GIS heritage map.

---

## Features

- 🔍 Upload a temple image → get **Nagara**, **Dravidian**, or **Kalinga** classification with confidence score
- 📊 All 3 class probabilities displayed as an interactive bar chart
- 🧠 **GradCAM heatmap** showing which image regions the model focused on
- 🔬 **LIME explanation** highlighting architectural segments that influenced the decision
- 🏛️ **Interactive 3D Virtual Museum** — explore 5 temple models (Konark Sun Temple, Ram Mandir, Nagara Shikhara, Uthirakosamangai Temple, South Indian Modular Kit) with WebGL rendering, auto-rotation, and orbit controls
- 🗺️ **GIS Heritage Map** with 20+ historical temple sites across India on a dark Leaflet map with historical summaries
- 📖 Architectural style breakdown — features, historical examples, materials, and dynastic origins
- ⚠️ Out-of-distribution detection — rejects non-temple images using a 0.85 confidence threshold

---

## Tech Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Three.js, React Three Fiber, Leaflet, Framer Motion | UI, 3D museum, GIS map, animations |
| **Backend** | Flask 3.0, Gunicorn, Docker, Flask-Limiter, Flask-CORS | REST API, rate limiting, containerized deployment |
| **ML / AI** | EfficientNetB0, TensorFlow 2.20, Keras 3.12, GradCAM, LIME | Image classification, explainability heatmaps |
| **Tools** | OpenCV, Pillow, scikit-learn, Matplotlib | Image preprocessing, visualization |

---

## How It Works

1. User uploads a temple image
2. Frontend simultaneously calls `POST /predict` and `POST /explain`
3. `/predict` runs EfficientNetB0 inference and returns the style, confidence, and all 3 class probabilities instantly
4. Result card renders immediately with the confidence bar chart
5. `/explain` runs GradCAM and LIME in the background (20–40 seconds) and returns base64 heatmaps
6. GradCAM and LIME cards render below the result once ready

---

## Model Details

- **Architecture:** EfficientNetB0 with custom head (GAP → BatchNorm → Dropout → Dense 256 → Softmax)
- **Training:** Two-phase transfer learning
  - Phase 1: Base frozen, `lr=1e-3` (head only)
  - Phase 2: Top 30 layers unfrozen, `lr=1e-5` (fine-tuning)
- **Dataset:** ~165 images/class with per-class augmentation intensity
- **Classes:** Nagara, Dravidian, Kalinga
- **OOD threshold:** 0.85 confidence — below this returns Unknown/Non-Temple
- **XAI:** GradCAM on `top_activation` layer + LIME with 300 superpixel samples

---

## Project Structure

```
DevAalaya/
├── backend/
│   ├── app.py                  # Flask entry + eager model loader
│   ├── config.py               # Paths, thresholds, directories
│   ├── Dockerfile              # Production container
│   ├── requirements.txt        # Python dependencies
│   ├── models/
│   │   ├── devalaya_final_model.keras
│   │   └── class_names.json
│   ├── routes/
│   │   ├── predict_routes.py   # POST /predict
│   │   └── explain_routes.py   # POST /explain
│   └── services/
│       ├── predictor.py        # Preprocessing + CNN inference
│       └── gradcam.py          # GradCAM + LIME generation
├── frontend/
│   ├── public/
│   │   └── models/             # Draco-compressed GLB files
│   ├── src/
│   │   ├── components/         # ResultDisplay, ModelViewer, etc.
│   │   ├── pages/              # Home, Museum, Detail pages
│   │   └── App.jsx             # Routing and layout
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker Desktop (for Option B)

---

### Option A — Local Development

**Backend:**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

### Option B — Docker

```bash
cd backend
docker build -t devalaya-backend .
docker run -p 5000:5000 devalaya-backend
# Backend runs on http://localhost:5000
```

Then run the frontend locally as shown in Option A.

---

## API Reference

### `POST /predict`
```
Content-Type: multipart/form-data
Body: image (file)
```
```json
{
  "success": true,
  "prediction": "dravidian",
  "confidence": 0.982,
  "uncertain": false,
  "class_probabilities": {
    "dravidian": 98.2,
    "nagara": 1.1,
    "kalinga": 0.7
  }
}
```

### `POST /explain`
```
Content-Type: multipart/form-data
Body: image (file)
```
```json
{
  "success": true,
  "prediction": "dravidian",
  "confidence": 0.982,
  "uncertain": false,
  "gradcam_base64": "iVBORw0KGgo...",
  "lime_base64": "iVBORw0KGgo..."
}
```
> ⏱️ Note: `/explain` takes 20–40 seconds due to LIME computation.

### `GET /health`
```json
{ "status": "ok", "message": "DevAlaya backend running" }
```

---

## Known Limitations

- **Small dataset (~165 images/class):** May produce false positives on non-temple images with circular ornate structures (e.g. emblems, badges) that visually resemble the Amalaka stone disc motif in Kalinga architecture. The 0.85 OOD threshold reduces but does not eliminate all edge cases.

- **GradCAM background attention:** With limited training data, the model occasionally attends to background textures (sky, vegetation, stone) rather than primary architectural discriminators (Shikhara curvature, Gopuram pyramid ratio, Deula height). This is a known limitation of transfer learning on small domain-specific datasets.

- **Three styles only:** Covers Nagara, Dravidian, and Kalinga lineages. Regional substyles (Vesara, Hemadpanthi, Kerala) and Indo-Islamic hybrid architecture are outside the current scope.

---

## Future Improvements

- Expand dataset to 500+ images/class using Wikimedia Commons CC-licensed temple photographs
- Add negative sample training (non-temple images) to improve OOD rejection accuracy
- Migrate `architectureData.js` to SQLite with dynamic Flask API endpoints
- Add 3D hotspot annotations on museum models using `@react-three/drei` Html overlays
- Implement Leaflet marker clustering and dynasty-based map filtering

---

## License

MIT License © 2025 Prajna Shetty — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- EfficientNet (Tan & Le, 2019) for the base architecture
- LIME (Ribeiro et al., 2016) for model interpretability
- React Three Fiber and Three.js community for WebGL tooling
- Wikimedia Commons contributors for temple reference imagery
