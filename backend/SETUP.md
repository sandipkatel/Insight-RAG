# InsightRAG Backend Setup Guide

Complete step-by-step guide to get the FastAPI backend running and integrated with the frontend.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Running the Server](#running-the-server)
4. [Testing the API](#testing-the-api)
5. [Frontend Integration](#frontend-integration)
6. [Troubleshooting](#troubleshooting)

## Quick Start

### Windows (Fastest)
```bash
cd backend
run.bat
```

### macOS/Linux
```bash
cd backend
chmod +x run.sh
./run.sh
```

The backend will start at `http://localhost:8000`

---

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Step 1: Check Python Version
```bash
python --version
# or
python3 --version
```

Should show 3.8+. If not, install Python from https://www.python.org

### Step 2: Navigate to Backend Directory
```bash
cd s:\Documents\Projects\Insight-RAG\backend
```

### Step 3: Create Virtual Environment (Optional but Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

This installs:
- FastAPI 0.104.1 - Web framework
- Uvicorn 0.24.0 - ASGI server
- Pydantic 2.5.0 - Data validation
- python-multipart 0.0.6 - Form data handling

---

## Running the Server

### Option 1: Automated Script (Easiest)

**Windows:**
```bash
run.bat
```

**macOS/Linux:**
```bash
./run.sh
```

### Option 2: Manual Python
```bash
python main.py
```

### Option 3: Uvicorn with Custom Settings
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Expected Output
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

## Testing the API

### Automated Test Script
```bash
python test_api.py
```

This runs comprehensive tests on all endpoints and displays a summary.

### Manual Testing

#### 1. Interactive Documentation (Easiest)
Open http://localhost:8000/docs in your browser

You can test all endpoints directly from the UI:
- Click on an endpoint
- Click "Try it out"
- Enter parameters if needed
- Click "Execute"

#### 2. Health Check
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "InsightRAG API"
}
```

#### 3. Get Knowledge Base Document
```bash
curl http://localhost:8000/api/document
```

#### 4. Get Preset Queries
```bash
curl http://localhost:8000/api/preset-queries
```

#### 5. Query Models (Main Endpoint)
```bash
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query":"How many days can I work remotely per week?"}'
```

#### 6. Get Models Information
```bash
curl http://localhost:8000/api/models
```

#### Using Python Requests
```python
import requests

response = requests.post(
    "http://localhost:8000/api/query",
    json={"query": "What is the vacation policy?"}
)
print(response.json())
```

---

## Frontend Integration

### Step 1: Stop/Restart Backend
Make sure the backend is running on `http://localhost:8000`

### Step 2: Update Frontend API Client
The backend is already set up to handle all API calls. Update your frontend code to call the backend instead of using mock data.

**Example API client functions** (see `api_client_example.ts`):

```typescript
// Query all models from the backend
async function queryAllModelsStreaming(query: string) {
  const response = await fetch('http://localhost:8000/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  return data;
}

// Get knowledge base document
async function getKnowledgeBase() {
  const response = await fetch('http://localhost:8000/api/document');
  return response.json();
}

// Get preset queries
async function getPresetQueries() {
  const response = await fetch('http://localhost:8000/api/preset-queries');
  return response.json();
}
```

### Step 3: Update Environment Variables (Optional)
In your frontend `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 4: Update Frontend Code

Replace the mock data calls with API calls:

**Before (Mock Data):**
```typescript
import { mockData } from '@/lib/mockData';

const results = mockData;
```

**After (API Call):**
```typescript
const response = await fetch('http://localhost:8000/api/query', {
  method: 'POST',
  body: JSON.stringify({ query: userQuery }),
});
const results = await response.json();
```

### Step 5: Test Frontend-Backend Connection
1. Start frontend: `cd frontend && npm run dev`
2. Start backend: `cd backend && python main.py`
3. Open http://localhost:3000 in browser
4. Try a query - it should hit the backend API
5. Check browser console for any errors

---

## API Endpoints Reference

| Endpoint | Method | Description | Query/Body |
|----------|--------|-------------|-----------|
| `/health` | GET | Health check | N/A |
| `/api/document` | GET | Get knowledge base | N/A |
| `/api/preset-queries` | GET | Get suggested queries | N/A |
| `/api/query` | POST | Query all models | `{"query": "..."}` |
| `/api/models` | GET | Get model info | N/A |

### Response Examples

**POST /api/query**
```json
{
  "query": "How many days can I work remotely per week?",
  "responses": [
    {
      "mode": "parametric",
      "answer": "Employees can work remotely 4 days per week.",
      "confidence": 75,
      "latencyMs": 125,
      "hallucinations": ["5 days per week mentioned"]
    },
    {
      "mode": "finetuned",
      "answer": "Remote work policy allows approximately 4 days per week.",
      "confidence": 82,
      "latencyMs": 89
    },
    {
      "mode": "rag",
      "answer": "According to our policy, employees can work remotely 4 days per week...",
      "confidence": 98,
      "latencyMs": 234,
      "retrievedChunks": [
        {
          "id": "chunk-2",
          "text": "Remote work policy...",
          "source": "Company Handbook",
          "score": 0.95
        }
      ],
      "citations": [
        {
          "chunkId": "chunk-2",
          "sentence": "Employees may work remotely..."
        }
      ]
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Troubleshooting

### Backend Won't Start

**Error: `Address already in use`**
```bash
# Find what's using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use a different port
uvicorn main:app --port 8001
```

**Error: `ModuleNotFoundError: No module named 'fastapi'`**
```bash
# Install dependencies
pip install -r requirements.txt

# Or install FastAPI manually
pip install fastapi uvicorn pydantic
```

**Error: `Python version too old`**
```bash
# Check version
python --version

# Install Python 3.8+ from https://www.python.org
```

### Frontend Can't Connect to Backend

**CORS Error in Console:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/query' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:** Backend is already configured for CORS. Check:
1. Backend is running on http://localhost:8000
2. Frontend is running on http://localhost:3000
3. No firewall blocking connections
4. No proxy interfering with requests

### Tests Failing

**Run the test script for diagnostics:**
```bash
python test_api.py
```

This will show exactly which endpoints are having issues.

### Port Already in Use

**Check if backend is already running:**
```bash
# Windows
netstat -ano | findstr :8000

# macOS/Linux
lsof -i :8000
```

**If running on port 8000 and you want to use a different port:**

Edit `main.py` and change:
```python
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Change port here
```

### Debugging

**Enable verbose logging:**

In `main.py`, add after imports:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Check Request/Response:**

Use the Swagger UI at http://localhost:8000/docs to see detailed request/response data.

---

## File Structure

```
backend/
├── main.py                 # FastAPI application with all endpoints
├── models.py              # Pydantic data models
├── mock_data.py           # Mock knowledge base and responses
├── requirements.txt       # Python dependencies
├── test_api.py            # Comprehensive API tests
├── api_client_example.ts  # Example frontend integration code
├── run.bat                # Windows startup script
├── run.sh                 # macOS/Linux startup script
├── CONFIG.md              # Configuration and deployment guide
├── README.md              # Full API documentation
└── .gitignore             # Git ignore file
```

---

## Next Steps

1. ✅ Backend is installed and running
2. ✅ API endpoints are tested and working
3. 🔄 Update frontend to call backend API instead of mock data
4. 🔄 Test end-to-end query flow
5. 📊 Monitor backend performance in production
6. 🔐 Add authentication if needed

---

## Quick Command Reference

```bash
# Install dependencies
pip install -r requirements.txt

# Run backend (automated)
python main.py

# Run backend (with auto-reload for development)
uvicorn main:app --reload

# Run tests
python test_api.py

# Access documentation
# Swagger UI: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc

# Query examples
curl http://localhost:8000/health
curl http://localhost:8000/api/document
curl http://localhost:8000/api/preset-queries
curl -X POST http://localhost:8000/api/query -H "Content-Type: application/json" -d '{"query":"Your question here"}'
```

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the [README.md](README.md) for detailed API documentation
3. Run `python test_api.py` to diagnose issues
4. Check backend console output for error messages

Happy coding! 🚀
