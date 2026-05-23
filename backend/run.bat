@echo off
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting InsightRAG Backend API...
echo Server will run at http://localhost:8000
echo Docs available at http://localhost:8000/docs
echo.

python main.py
