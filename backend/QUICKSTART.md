# InsightRAG Backend - Quick Start (30 seconds)

## Start Backend (Choose One)

### ⚡ Fastest (Windows)
```bash
cd backend
run.bat
```

### Fastest (macOS/Linux)
```bash
cd backend
./run.sh
```

### Manual
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## Verify It's Working

Open http://localhost:8000/docs in your browser

## Available Endpoints

```
GET    http://localhost:8000/health
GET    http://localhost:8000/api/document
GET    http://localhost:8000/api/preset-queries
POST   http://localhost:8000/api/query          (body: {"query": "..."})
GET    http://localhost:8000/api/models
```

## Quick Test

```bash
# In another terminal:
python test_api.py
```

## Frontend Integration

Update your frontend to use:
```typescript
const response = await fetch('http://localhost:8000/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: userQuery }),
});
```

## Troubleshooting

**Backend won't start?** Check Python version:
```bash
python --version  # Should be 3.8+
```

**Port already in use?** 
```bash
# Windows: Find process
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux: Find process
lsof -i :8000
kill -9 <PID>
```

**CORS errors?** Backend CORS is already configured ✓

---

📚 **Full Documentation:** See `SETUP.md`, `README.md`, `CONFIG.md`

✅ **Ready to go!** Backend is fully functional with mock data.
