"use client";
import { useState, KeyboardEvent } from "react";
import { Search, Zap, Tag } from "lucide-react";
import { PresetQuery, QueryCategory } from "../lib/types";
import { PRESET_QUERIES } from "../lib/mockData";

interface Props {
  onQuery: (query: string) => void;
  isLoading: boolean;
}

const CATEGORY_LABELS: Record<QueryCategory, { label: string; color: string }> = {
  factual: { label: "Factual", color: "bg-ink/10 text-ink/60" },
  recent: { label: "Up-to-date", color: "bg-amber-warm/15 text-amber-warm" },
  multihop: { label: "Multi-hop", color: "bg-teal-rag/15 text-teal-rag" },
  unanswerable: { label: "Unanswerable", color: "bg-accent/10 text-accent" },
};

export default function QueryPanel({ onQuery, isLoading }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const q = value.trim();
    if (!q || isLoading) return;
    onQuery(q);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const selectPreset = (q: PresetQuery) => {
    setValue(q.text);
    onQuery(q.text);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-4">
      {/* Input area */}
      <div className="relative">
        <div className="absolute left-4 top-4 text-ink/30">
          <Search size={16} />
        </div>
        <textarea
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={isLoading}
          placeholder="Ask a question about the company knowledge base…"
          className="w-full bg-white border border-paper-darker rounded-lg pl-10 pr-24 py-3.5 text-sm font-body text-ink placeholder:text-ink/25 resize-none focus:outline-none focus:ring-1 focus:ring-ink/20 focus:border-ink/30 transition-all shadow-sm"
        />
        <button
          onClick={submit}
          disabled={!value.trim() || isLoading}
          className="absolute right-3 bottom-3 flex items-center gap-1.5 px-4 py-1.5 bg-ink text-paper text-xs font-mono rounded-md hover:bg-ink-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Zap size={11} />
          Ask
        </button>
      </div>

      {/* Preset queries */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-mono text-ink/30 mr-1 flex items-center gap-1">
          <Tag size={10} /> Try:
        </span>
        {PRESET_QUERIES.map((q) => {
          const cat = CATEGORY_LABELS[q.category];
          return (
            <button
              key={q.text}
              onClick={() => selectPreset(q)}
              disabled={isLoading}
              title={q.description}
              className="group flex items-center gap-2 bg-white border border-paper-darker rounded-full px-3 py-1 text-xs text-ink/60 hover:border-ink/20 hover:text-ink hover:bg-paper-dark transition-all disabled:opacity-40"
            >
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${cat.color}`}>
                {cat.label}
              </span>
              <span className="max-w-[200px] truncate">{q.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
