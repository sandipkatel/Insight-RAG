# InsightRAG Backend API

A FastAPI backend that serves three API endpoints for the InsightRAG application, providing mock responses from three LLM strategies: Parametric, Fine-tuned, and RAG.

## Features

- **Three Query Models**: Compare responses from Parametric LLM, Fine-tuned LLM, and RAG
- **Mock Data**: Pre-populated responses based on company policy knowledge base
- **REST API**: Easy-to-use endpoints for frontend integration
- **CORS Enabled**: Frontend-friendly cross-origin configuration
- **Interactive Docs**: Built-in Swagger UI and ReDoc documentation

## Project Structure

```
backend/
├── main.py           # FastAPI application with endpoints
├── models.py         # Pydantic data models
├── mock_data.py      # Mock responses and knowledge base
├── requirements.txt  # Python dependencies
└── README.md         # This file
```

## Installation

1. **Create a Python virtual environment** (optional but recommended):

```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

2. **Install dependencies**:

```bash
pip install -r requirements.txt
```

## Running the Server

Start the development server:

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Alternative: Using Uvicorn directly

```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

### 1. **Health Check**
```
GET /health
```
Returns server status.

**Response:**
```json
{
  "status": "healthy",
  "service": "InsightRAG API"
}
```

---

### 2. **Get Knowledge Base Document**
```
GET /api/document
```
Returns the company knowledge base with all indexed chunks.

**Response:**
```json
{
  "id": "doc-1",
  "title": "Company Knowledge Base — Internal Policy Manual v3.2",
  "content": "...",
  "chunks": [...]
}
```

---

### 3. **Get Preset Queries**
```
GET /api/preset-queries
```
Returns predefined queries for testing the system.

**Response:**
```json
[
  {
    "text": "How many days can I work remotely per week?",
    "category": "factual",
    "description": "Factual lookup — tests precise retrieval"
  },
  ...
]
```

---

### 4. **Query All Models** (Main Endpoint)
```
POST /api/query
Content-Type: application/json

{
  "query": "How many days can I work remotely per week?"
}
```

Returns responses from all three models with citations, retrieved chunks, confidence scores, and latency metrics.

**Response:**
```json
{
  "query": "How many days can I work remotely per week?",
  "timestamp": "2024-01-15T10:30:00",
  "responses": [
    {
      "mode": "parametric",
      "answer": "...",
      "confidence": 42,
      "latencyMs": 820,
      "hallucinations": ["..."]
    },
    {
      "mode": "finetuned",
      "answer": "...",
      "confidence": 67,
      "latencyMs": 950
    },
    {
      "mode": "rag",
      "answer": "...",
      "confidence": 97,
      "latencyMs": 1340,
      "citations": [...],
      "retrievedChunks": [...]
    }
  ]
}
```

---

### 5. **Get Available Models**
```
GET /api/models
```
Returns information about the three available models.

**Response:**
```json
{
  "models": [
    {
      "mode": "parametric",
      "name": "Parametric LLM",
      "description": "No retrieval · Parameters only"
    },
    ...
  ]
}
```

---

## Data Models

### QueryRequest
```python
{
  "query": str  # The question to ask
}
```

### QueryResult
```python
{
  "query": str,
  "timestamp": datetime,
  "responses": List[ModelResponse]
}
```

### ModelResponse
```python
{
  "mode": "parametric" | "finetuned" | "rag",
  "answer": str,
  "citations": List[Citation] | None,       # For RAG mode
  "retrievedChunks": List[Chunk] | None,   # For RAG mode
  "hallucinations": List[str] | None,      # Flagged hallucinated phrases
  "latencyMs": int | None,                  # Response time
  "confidence": int | None                  # Confidence percentage (0-100)
}
```

## Testing the API

### Using cURL

```bash
# Test health check
curl http://localhost:8000/health

# Get knowledge base
curl http://localhost:8000/api/document

# Get preset queries
curl http://localhost:8000/api/preset-queries

# Query the models
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "How many days can I work remotely per week?"}'
```

### Using Swagger UI

Open your browser and navigate to:
```
http://localhost:8000/docs
```

### Using ReDoc

```
http://localhost:8000/redoc
```

## Connecting to Frontend

Update the frontend API client to point to the backend:

In `frontend/app/lib/api.ts`, update the base URL:
```typescript
const API_BASE_URL = "http://localhost:8000/api";

export async function queryAllModelsStreaming(
  query: string,
  onUpdate: (result: QueryResult, mode: string) => void
) {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  
  const result = await response.json();
  // Process results...
}
```

## Production Deployment

For production deployment, use a production-grade ASGI server:

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Environment Variables

You can set custom configuration using environment variables:

```bash
export API_PORT=8000
export API_HOST=0.0.0.0
export CORS_ORIGINS="http://localhost:3000,http://example.com"
```

## License

This project is part of InsightRAG and follows the same license terms.
