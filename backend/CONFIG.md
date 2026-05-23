# InsightRAG Backend Configuration

## Development Configuration

### Environment Variables

Create a `.env` file in the backend directory (optional):

```bash
# Server Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_ENV=development

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=INFO
```

### Running Locally

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:

**Windows:**
```bash
run.bat
```

**macOS/Linux:**
```bash
chmod +x run.sh
./run.sh
```

**Manual:**
```bash
python main.py
```

The server will start at `http://localhost:8000`

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/document` | Get knowledge base |
| GET | `/api/preset-queries` | Get preset queries |
| POST | `/api/query` | Query all models |
| GET | `/api/models` | Get model information |

## Testing

### Quick Test with Python

```python
import requests

# Test health
response = requests.get("http://localhost:8000/health")
print(response.json())

# Query models
query_data = {"query": "How many days can I work remotely per week?"}
response = requests.post(
    "http://localhost:8000/api/query",
    json=query_data
)
print(response.json())
```

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Production Deployment

### Using Gunicorn

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t insight-rag-backend .
docker run -p 8000:8000 insight-rag-backend
```

### Environment Variables for Production

```bash
# Server
API_HOST=0.0.0.0
API_PORT=8000
API_ENV=production

# CORS - set to your frontend domain
CORS_ORIGINS=https://yourdomain.com

# Security
SECRET_KEY=your-secret-key-here
```

## Performance Tips

1. **Use a production ASGI server** (Gunicorn with Uvicorn workers)
2. **Enable gzip compression** in your reverse proxy (Nginx, etc.)
3. **Cache responses** for static data (document, preset queries)
4. **Use Redis** for caching in production
5. **Monitor performance** with application monitoring tools

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### CORS Errors

Ensure the frontend URL is in the CORS allowed origins in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    ...
)
```

### Python Version Issues

Ensure you're using Python 3.8+:

```bash
python --version  # or python3 --version
```

## API Rate Limiting (Optional)

To add rate limiting, install and use `slowapi`:

```bash
pip install slowapi
```

Add to `main.py`:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/query")
@limiter.limit("100/minute")
async def query_models(request: QueryRequest):
    ...
```
