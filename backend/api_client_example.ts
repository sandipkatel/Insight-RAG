"""
Example API client configuration for connecting frontend to backend.

Update your frontend/app/lib/api.ts file with these configurations.
"""

import { QueryResult, ModelResponse, Chunk } from "./types";

// Backend API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface QueryResponse {
  query: string;
  timestamp: string;
  responses: Array<{
    mode: "parametric" | "finetuned" | "rag";
    answer: string;
    citations?: Array<{ chunkId: string; sentence: string }>;
    retrievedChunks?: Array<{
      id: string;
      text: string;
      source: string;
      page: number;
      score: number;
    }>;
    hallucinations?: string[];
    latencyMs?: number;
    confidence?: number;
  }>;
}

/**
 * Query all models from the backend
 * @param query - The user's question
 * @param onUpdate - Callback function that receives updates as models complete
 */
export async function queryAllModelsStreaming(
  query: string,
  onUpdate: (result: QueryResult, completedMode: string) => void
) {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: QueryResponse = await response.json();

    // Convert API response to frontend QueryResult format
    const result: QueryResult = {
      query: data.query,
      responses: data.responses as ModelResponse[],
      timestamp: new Date(data.timestamp),
    };

    // Simulate streaming by calling onUpdate for each response
    // In a real implementation, you might use Server-Sent Events for true streaming
    for (const response of data.responses) {
      onUpdate(result, response.mode);
      // Small delay to simulate streaming effect
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error("Query failed:", error);
    throw error;
  }
}

/**
 * Get the knowledge base document
 */
export async function getKnowledgeBase() {
  const response = await fetch(`${API_BASE_URL}/document`);
  if (!response.ok) throw new Error("Failed to fetch document");
  return response.json();
}

/**
 * Get preset queries for the UI
 */
export async function getPresetQueries() {
  const response = await fetch(`${API_BASE_URL}/preset-queries`);
  if (!response.ok) throw new Error("Failed to fetch preset queries");
  return response.json();
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL.replace("/api", "")}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
