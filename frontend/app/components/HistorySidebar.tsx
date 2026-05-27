"use client";
import { Clock, ChevronRight, Trash2 } from "lucide-react";
import { QueryResult } from "../lib/types";

interface Props {
  history: QueryResult[];
  onSelect: (result: QueryResult) => void;
  activeQuery: string | null;
  onClear: () => void;
}

export default function HistorySidebar({
  history,
  onSelect,
  activeQuery,
  onClear,
}: Props) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-8 gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
          <Clock size={16} className="text-white/15" />
        </div>
        <p className="text-[10px] font-mono text-white/20 text-center leading-relaxed">
          Query history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 shrink-0">
        <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">
          History
        </span>
        <button
          onClick={onClear}
          className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-coral/60 hover:bg-coral/5 rounded-md transition-all"
          title="Clear history"
        >
          <Trash2 size={10} />
        </button>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto py-1">
        {[...history].reverse().map((item, i) => {
          const isActive = item.query === activeQuery;
          const ragResponse = item.responses.find((r) => r.mode === "rag");
          const conf = ragResponse?.confidence;

          return (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className={`w-full text-left px-3 py-3 border-b border-white/[0.04] flex items-start gap-2 group transition-all ${
                isActive
                  ? "bg-neon-teal/8 border-l-2 border-l-neon-teal/60"
                  : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
              }`}
            >
              <div className="flex-1 min-w-0 space-y-1">
                <p
                  className={`text-[11px] font-mono leading-tight line-clamp-2 transition-colors ${
                    isActive
                      ? "text-white/70"
                      : "text-white/35 group-hover:text-white/55"
                  }`}
                >
                  {item.query}
                </p>
                {conf !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${conf >= 80 ? "bg-neon-teal/60" : conf >= 50 ? "bg-electric-amber/60" : "bg-coral/60"}`}
                        style={{ width: `${conf}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-white/20 shrink-0">
                      {conf}%
                    </span>
                  </div>
                )}
              </div>
              <ChevronRight
                size={10}
                className={`mt-0.5 shrink-0 transition-colors ${
                  isActive
                    ? "text-neon-teal/50"
                    : "text-white/10 group-hover:text-white/30"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
