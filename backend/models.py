from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel


class Mode(str, Enum):
    """Model types"""

    parametric = "parametric"
    finetuned = "finetuned"
    rag = "rag"


class QueryCategory(str, Enum):
    """Query categories"""

    factual = "factual"
    recent = "recent"
    multihop = "multihop"
    unanswerable = "unanswerable"


class Chunk(BaseModel):
    """Document chunk"""

    id: str
    text: str
    source: str
    page: int
    score: float
    highlighted: Optional[bool] = None


class Citation(BaseModel):
    """Citation linking answer to source"""

    chunkId: str
    sentence: str


class ModelResponse(BaseModel):
    """Response from a single model"""

    mode: Mode
    answer: str
    citations: Optional[List[Citation]] = None
    retrievedChunks: Optional[List[Chunk]] = None
    hallucinations: Optional[List[str]] = None
    latencyMs: Optional[int] = None
    confidence: Optional[int] = None


class QueryResult(BaseModel):
    """Complete query result with all model responses"""

    query: str
    responses: List[ModelResponse]
    timestamp: datetime


class Document(BaseModel):
    """Knowledge base document"""

    id: str
    title: str
    content: str
    chunks: List[Chunk]


class PresetQuery(BaseModel):
    """Preset query template"""

    text: str
    category: QueryCategory
    description: str


class QueryRequest(BaseModel):
    """Request to query the models"""

    query: str
