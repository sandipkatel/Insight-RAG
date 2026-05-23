"use client";
import { useState, useCallback } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

import Header from "./components/Header";
import QueryPanel from "./components/QueryPanel";
import ResponseCard from "./components/ResponseCard";
import SourcePanel from "./components/SourcePanel";
import HistorySidebar from "./components/HistorySidebar";
import TeachMePanel from "./components/TeachMePanel";

import { QueryResult, ModelResponse, Chunk } from "./lib/types";
import { MOCK_DOCUMENT } from "./lib/mockData";
import { queryAllModelsStreaming } from "./lib/api";

export default function Home() {
  const [activeResult, setActiveResult] = useState<QueryResult | null>(null);
  const [loadingModes, setLoadingModes] = useState<Set<string>>(new Set());
  const [partialResults, setPartialResults] = useState<Record<string, ModelResponse>>({});
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [highlightedChunkId, setHighlightedChunkId] = useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = useState(true);

  const handleQuery = useCallback(async (query: string) => {
    setLoadingModes(new Set(["parametric", "finetuned", "rag"]));
    setPartialResults({});
    setHighlightedChunkId(null);
    setActiveResult(null);

    let finalResult: QueryResult | null = null;

    await queryAllModelsStreaming(query, (result, completedMode) => {
      finalResult = result;
      const response = result.responses.find((r) => r.mode === completedMode);
      if (response) {
        setPartialResults((prev) => ({ ...prev, [completedMode]: response }));
        setLoadingModes((prev) => {
          const next = new Set(prev);
          next.delete(completedMode);
          return next;
        });
      }
    });

    if (finalResult) {
      setActiveResult(finalResult);
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.query !== query);
        return [...filtered, finalResult!];
      });
    }
  }, []);

  const handleChunkClick = (chunk: Chunk) => {
    setHighlightedChunkId(chunk.id);
    if (!sourceOpen) setSourceOpen(true);
  };

  const getResponse = (mode: string): ModelResponse | null => {
    return partialResults[mode] ?? null;
  };

  const isLoading = (mode: string) => loadingModes.has(mode);
  const anyLoading = loadingModes.size > 0;

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />
      <QueryPanel onQuery={handleQuery} isLoading={anyLoading} />

      <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
        {/* History sidebar */}
        <aside className="hidden xl:flex flex-col w-52 shrink-0 border-r border-paper-darker bg-paper-dark/30">
          <HistorySidebar
            history={history}
            activeQuery={activeResult?.query ?? null}
            onSelect={(r) => {
              setActiveResult(r);
              const responses: Record<string, ModelResponse> = {};
              r.responses.forEach((resp) => { responses[resp.mode] = resp; });
              setPartialResults(responses);
              setLoadingModes(new Set());
            }}
            onClear={() => setHistory([])}
          />
        </aside>

        {/* Centre */}
        <main className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 min-w-0">
          {!activeResult && !anyLoading && (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
              <div className="text-5xl font-display font-light italic text-ink/10 select-none">
                Ask anything.
              </div>
              <p className="text-sm font-mono text-ink/20 max-w-sm">
                Type a question above or pick a preset to see how Parametric, Fine-tuned, and RAG models compare.
              </p>
            </div>
          )}

          {(activeResult || anyLoading) && (
            <div className="pt-2">
              <p className="text-[10px] font-mono text-ink/30 uppercase tracking-widest mb-1">Query</p>
              <p className="text-base font-display font-medium text-ink/75 italic">
                &ldquo;{activeResult?.query ?? "Thinking\u2026"}&rdquo;
              </p>
            </div>
          )}

          {(activeResult || anyLoading) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {(["parametric", "finetuned", "rag"] as const).map((mode) => (
                <ResponseCard
                  key={mode}
                  response={getResponse(mode)}
                  isLoading={isLoading(mode)}
                  onChunkClick={handleChunkClick}
                  highlightedChunkId={highlightedChunkId}
                />
              ))}
            </div>
          )}

          {activeResult && !anyLoading && (
            <TeachMePanel result={activeResult} />
          )}
        </main>

        {/* Source panel */}
        <aside
          className={`hidden lg:flex flex-col shrink-0 border-l border-paper-darker transition-all duration-300 ${
            sourceOpen ? "w-72 xl:w-80" : "w-10"
          }`}
        >
          <button
            onClick={() => setSourceOpen(!sourceOpen)}
            className="flex items-center justify-center w-10 h-10 border-b border-paper-darker hover:bg-paper-dark/50 transition-colors shrink-0 self-end"
            title={sourceOpen ? "Collapse" : "Expand"}
          >
            {sourceOpen ? (
              <PanelRightClose size={14} className="text-ink/30" />
            ) : (
              <PanelRightOpen size={14} className="text-ink/30" />
            )}
          </button>
          {sourceOpen && (
            <div className="flex-1 overflow-hidden">
              <SourcePanel
                document={MOCK_DOCUMENT}
                highlightedChunkId={highlightedChunkId}
                onClose={() => setSourceOpen(false)}
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
