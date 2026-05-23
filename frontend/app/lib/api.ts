import { QueryResult } from "./types";
import { MOCK_RESPONSES } from "./mockData";

// This function simulates the API call with realistic staggered delays.
// Replace this with your actual backend calls when ready.
export async function queryAllModels(
  query: string,
  onProgress?: (mode: string) => void
): Promise<QueryResult> {
  // Normalize query for lookup
  const key = query.trim();
  const found = MOCK_RESPONSES[key];

  // Use a generic fallback if the query doesn't match a preset
  const result: QueryResult = found ?? buildGenericFallback(query);

  // Simulate staggered response times
  const sorted = [...result.responses].sort(
    (a, b) => (a.latencyMs ?? 1000) - (b.latencyMs ?? 1000)
  );

  // Return after simulating the slowest response
  const maxLatency = Math.max(...sorted.map((r) => r.latencyMs ?? 1000));
  await sleep(maxLatency);

  return result;
}

// Simulates streaming — calls onChunk as each model "responds"
export async function queryAllModelsStreaming(
  query: string,
  onModelComplete: (result: QueryResult, completedMode: string) => void
): Promise<QueryResult> {
  const key = query.trim();
  const result: QueryResult = MOCK_RESPONSES[key] ?? buildGenericFallback(query);

  // Simulate each model completing at its own latency
  const promises = result.responses.map(async (response) => {
    await sleep(response.latencyMs ?? 1000);
    onModelComplete(result, response.mode);
    return response;
  });

  await Promise.all(promises);
  return result;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildGenericFallback(query: string): QueryResult {
  return {
    query,
    timestamp: new Date(),
    responses: [
      {
        mode: "parametric",
        answer:
          "Based on general knowledge, I can provide some information about this topic, though I may not have specifics relevant to your company's policies. Please verify with official HR documentation.",
        hallucinations: ["I can provide some information about this topic"],
        confidence: 30,
        latencyMs: 800,
      },
      {
        mode: "finetuned",
        answer:
          "This query relates to company policy. My fine-tuned knowledge suggests consulting the relevant HR policy section for accurate details.",
        confidence: 55,
        latencyMs: 1000,
      },
      {
        mode: "rag",
        answer:
          "I searched the knowledge base but could not find a sufficiently relevant match for this query. The top retrieved chunks had low similarity scores. Please rephrase your question or check if relevant documentation has been indexed.",
        citations: [],
        retrievedChunks: [],
        confidence: 40,
        latencyMs: 1400,
      },
    ],
  };
}
