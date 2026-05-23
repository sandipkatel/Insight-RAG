"use client";
import { Clock, ChevronRight, RotateCcw } from "lucide-react";
import { QueryResult } from "../lib/types";

interface Props {
  history: QueryResult[];
  onSelect: (result: QueryResult) => void;
  activeQuery: string | null;
  onClear: () => void;
}

export default function HistorySidebar({ history, onSelect, activeQuery, onClear }: Props) {
  if (history.length === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <Clock size={20} className="mx-auto text-ink/15 mb-2" />
        <p className="text-xs font-mono text-ink/25">No queries yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-paper-darker">
        <span className="text-[10px] font-mono text-ink/30 uppercase tracking-widest">History</span>
        <button
          onClick={onClear}
          className="text-ink/20 hover:text-accent transition-colors"
          title="Clear history"
        >
          <RotateCcw size={11} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {[...history].reverse().map((item, i) => {
          const isActive = item.query === activeQuery;
          const ragResponse = item.responses.find((r) => r.mode === "rag");
          return (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className={`w-full text-left px-3 py-2.5 border-b border-paper-darker/50 flex items-start gap-2 group transition-colors ${
                isActive ? "bg-teal-rag/8 border-l-2 border-l-teal-rag" : "hover:bg-paper-dark/50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-body text-ink/60 leading-tight line-clamp-2 group-hover:text-ink transition-colors">
                  {item.query}
                </p>
                <p className="text-[9px] font-mono text-ink/25 mt-1">
                  {ragResponse?.confidence
                    ? `${ragResponse.confidence}% confidence`
                    : "—"}
                </p>
              </div>
              <ChevronRight size={10} className="text-ink/20 mt-0.5 shrink-0 group-hover:text-ink/40 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
