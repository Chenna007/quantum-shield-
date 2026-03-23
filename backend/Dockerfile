FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run DB migrations on startup
CMD ["sh", "-c", "python -c 'from core.database import init_db; init_db()' && uvicorn main:app --host 0.0.0.0 --port 8000"]
