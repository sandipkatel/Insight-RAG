import { QueryResult, PresetQuery, Document } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface QueryRequest {
  query: string;
}

// Fetch the knowledge base document from backend
export async function getDocument(): Promise<Document> {
  const response = await fetch(`${API_BASE_URL}/api/document`);
  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.statusText}`);
  }
  return response.json();
}

// Fetch preset queries from backend
export async function getPresetQueries(): Promise<PresetQuery[]> {
  const response = await fetch(`${API_BASE_URL}/api/preset-queries`);
  if (!response.ok) {
    throw new Error(`Failed to fetch preset queries: ${response.statusText}`);
  }
  return response.json();
}

// Query all models via backend API
export async function queryAllModels(query: string): Promise<QueryResult> {
  const payload: QueryRequest = { query };
  const response = await fetch(`${API_BASE_URL}/api/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to query models: ${response.statusText}`);
  }

  const result = await response.json();
  // Ensure timestamp is a Date object
  result.timestamp = new Date(result.timestamp);
  return result;
}

// Stream responses as they complete from backend
export async function queryAllModelsStreaming(
  query: string,
  onModelComplete: (result: QueryResult, completedMode: string) => void,
): Promise<QueryResult> {
  // For now, fetch all at once. In a real streaming scenario,
  // you'd use Server-Sent Events (SSE) or WebSocket
  const result = await queryAllModels(query);

  // Simulate streaming by calling onModelComplete for each response
  // Sort by latency to maintain order
  const sorted = [...result.responses].sort(
    (a, b) => (a.latencyMs ?? 1000) - (b.latencyMs ?? 1000),
  );

  for (const response of sorted) {
    // Simulate the time this model took
    await new Promise((resolve) =>
      setTimeout(resolve, response.latencyMs ?? 1000),
    );
    onModelComplete(result, response.mode);
  }

  return result;
}
