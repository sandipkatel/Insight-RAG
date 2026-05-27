"use client";
import { useState, KeyboardEvent, useEffect } from "react";
import { Search, Zap, Tag, Loader2 } from "lucide-react";
import { PresetQuery, QueryCategory } from "../lib/types";
import { getPresetQueries } from "../lib/api";

interface Props {
  onQuery: (query: string) => void;
  isLoading: boolean;
}

const CATEGORY_CONFIG: Record<QueryCategory, { label: string; color: string; dot: string }> = {
  factual:     { label: "Factual",       color: "bg-slate-700/60 text-slate-300 border-slate-600/50",          dot: "bg-slate-400" },
  recent:      { label: "Up-to-date",    color: "bg-electric-amber/10 text-electric-amber border-electric-amber/30", dot: "bg-electric-amber" },
  multihop:    { label: "Multi-hop",     color: "bg-neon-teal/10 text-neon-teal border-neon-teal/30",           dot: "bg-neon-teal" },
  unanswerable:{ label: "Unanswerable",  color: "bg-coral/10 text-coral border-coral/30",                      dot: "bg-coral" },
};

export default function QueryPanel({ onQuery, isLoading }: Props) {
  const [value, setValue] = useState("");
  const [presetQueries, setPresetQueries] = useState<PresetQuery[]>([]);
  const [presetLoading, setPresetLoading] = useState(true);
  const [presetError, setPresetError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        setPresetLoading(true);
        setPresetError(null);
        const queries = await getPresetQueries();
        setPresetQueries(queries);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load preset queries";
        setPresetError(message);
      } finally {
        setPresetLoading(false);
      }
    };
    fetchPresets();
  }, []);

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
    <div className="border-b border-white/5 bg-void/40 backdrop-blur-sm">
      <div className="max-w-screen-2xl mx-auto px-6 py-5 space-y-4">

        {/* Input area */}
        <div className={`relative rounded-xl border transition-all duration-300 ${
          focused
            ? "border-neon-teal/50 shadow-[0_0_0_1px_rgba(0,255,200,0.1),0_0_30px_rgba(0,255,200,0.06)]"
            : "border-white/10 shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
        } bg-surface`}>

          {/* Glow line top */}
          {focused && (
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-neon-teal/50 to-transparent rounded-full" />
          )}

          <div className="absolute left-4 top-4 text-white/20 pointer-events-none">
            <Search size={16} />
          </div>

          <textarea
            rows={2}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isLoading}
            placeholder="Ask anything about the knowledge base…"
            className="w-full bg-transparent border-0 outline-none pl-11 pr-28 py-4 text-sm font-mono text-white/80 placeholder:text-white/20 resize-none caret-neon-teal"
          />

          <button
            onClick={submit}
            disabled={!value.trim() || isLoading}
            className="absolute right-3 bottom-3 flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-all duration-200
              bg-neon-teal text-void hover:bg-neon-teal/90 hover:shadow-[0_0_20px_rgba(0,255,200,0.4)]
              disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />}
            {isLoading ? "Running" : "Ask"}
          </button>
        </div>

        {/* Preset queries */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-mono text-white/20 flex items-center gap-1 mr-1">
            <Tag size={9} /> Presets
          </span>

          {presetError && (
            <span className="text-[10px] font-mono text-coral/60">Failed to load presets</span>
          )}
          {presetLoading && (
            <span className="text-[10px] font-mono text-white/20 flex items-center gap-1">
              <Loader2 size={9} className="animate-spin" /> Loading…
            </span>
          )}

          {presetQueries.map((q) => {
            const cat = CATEGORY_CONFIG[q.category];
            return (
              <button
                key={q.text}
                onClick={() => selectPreset(q)}
                disabled={isLoading}
                title={q.description}
                className={`group flex items-center gap-2 border rounded-full px-3 py-1.5 text-xs font-mono
                  text-white/40 hover:text-white bg-surface/50 hover:bg-surface
                  transition-all duration-200 disabled:opacity-30 hover:border-white/20`}
              >
                <span className={`flex items-center gap-1 text-[9px] border px-1.5 py-0.5 rounded-full font-medium ${cat.color}`}>
                  <span className={`w-1 h-1 rounded-full ${cat.dot}`} />
                  {cat.label}
                </span>
                <span className="max-w-[180px] truncate">{q.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}