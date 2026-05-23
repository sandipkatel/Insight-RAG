export type Mode = "parametric" | "finetuned" | "rag";

export interface Chunk {
  id: string;
  text: string;
  source: string;
  page: number;
  score: number;
  highlighted?: boolean;
}

export interface Citation {
  chunkId: string;
  sentence: string;
}

export interface ModelResponse {
  mode: Mode;
  answer: string;
  citations?: Citation[];
  retrievedChunks?: Chunk[];
  hallucinations?: string[]; // sentences flagged as likely hallucinated
  latencyMs?: number;
  confidence?: number;
}

export interface QueryResult {
  query: string;
  responses: ModelResponse[];
  timestamp: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  chunks: Chunk[];
}

export type QueryCategory = "factual" | "recent" | "multihop" | "unanswerable";

export interface PresetQuery {
  text: string;
  category: QueryCategory;
  description: string;
}
