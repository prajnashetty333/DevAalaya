FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn==21.2.0

ENV PYTHONUNBUFFERED=1
ENV KERAS_BACKEND=tensorflow

COPY . .

RUN mkdir -p temp_uploads predictions heatmaps logs

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", \
     "--timeout", "180", "app:app"]
