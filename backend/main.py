from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mock_data import MOCK_DOCUMENT, PRESET_QUERIES, get_mock_response
from models import Document, Mode, PresetQuery, QueryRequest, QueryResult

app = FastAPI(
    title="InsightRAG API",
    description="Backend API for InsightRAG - Compare LLM strategies",
    version="1.0.0",
)

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "InsightRAG API"}


@app.get("/api/document", response_model=Document, tags=["Knowledge Base"])
async def get_knowledge_base():
    """
    Get the knowledge base document with all chunks.

    Returns:
        Document: The company knowledge base with chunks
    """
    return MOCK_DOCUMENT


@app.get("/api/preset-queries", response_model=List[PresetQuery], tags=["Queries"])
async def get_preset_queries():
    """
    Get all preset query templates.

    Returns:
        List[PresetQuery]: List of preset queries for testing
    """
    return PRESET_QUERIES


@app.post("/api/query", response_model=QueryResult, tags=["Query Processing"])
async def query_models(request: QueryRequest):
    """
    Query all three models (Parametric, Fine-tuned, RAG) with a question.

    Args:
        request (QueryRequest): The query text

    Returns:
        QueryResult: Results from all three models with responses, citations, and metadata
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Get mock response for the query
    result = get_mock_response(request.query)
    return result


@app.get("/api/models", tags=["Models"])
async def get_models():
    """
    Get information about available models.

    Returns:
        dict: Information about each model type
    """
    return {
        "models": [
            {
                "mode": Mode.parametric,
                "name": "Parametric LLM",
                "description": "No retrieval · Parameters only",
                "sublabel": "Uses only training parameters",
            },
            {
                "mode": Mode.finetuned,
                "name": "Fine-tuned LLM",
                "description": "Domain-adapted · Static knowledge",
                "sublabel": "Fine-tuned on domain-specific data",
            },
            {
                "mode": Mode.rag,
                "name": "RAG",
                "description": "Retrieved + generated · Grounded",
                "sublabel": "Retrieval-augmented with knowledge base",
            },
        ]
    }


@app.get("/", tags=["Info"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": "InsightRAG API",
        "description": "Backend for comparing LLM strategies - Parametric, Fine-tuned, and RAG",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "document": "/api/document",
            "preset_queries": "/api/preset-queries",
            "query": "/api/query",
            "models": "/api/models",
            "docs": "/docs",
            "redoc": "/redoc",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
