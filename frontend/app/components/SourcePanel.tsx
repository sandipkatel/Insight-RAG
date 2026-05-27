"use client";
import { useEffect, useRef, useState } from "react";
import { BookOpen, X, Sparkles } from "lucide-react";
import { Document } from "../lib/types";

interface Props {
  document: Document;
  highlightedChunkId: string | null;
  onClose?: () => void;
}

export default function SourcePanel({
  document,
  highlightedChunkId,
  onClose,
}: Props) {
  const chunkRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [justHighlighted, setJustHighlighted] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightedChunkId) return;
    const el = chunkRefs.current[highlightedChunkId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setJustHighlighted(highlightedChunkId);
      const t = setTimeout(() => setJustHighlighted(null), 2000);
      return () => clearTimeout(t);
    }
  }, [highlightedChunkId]);

  return (
    <div className="flex flex-col h-full bg-surface border border-white/5 rounded-xl overflow-hidden">
      {/* Top accent */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neon-teal/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-neon-teal/[0.02] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 bg-neon-teal/10 border border-neon-teal/20 rounded-md flex items-center justify-center shrink-0">
            <BookOpen size={11} className="text-neon-teal/60" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-mono font-semibold text-white/60 truncate">
              {document.title}
            </p>
            <p className="text-[9px] font-mono text-white/20">
              {document.chunks.length} indexed chunks
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/5 rounded-md transition-all ml-2 shrink-0"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Chunks */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {document.chunks.map((chunk, i) => {
          const isHighlighted = highlightedChunkId === chunk.id;
          const isFlashing = justHighlighted === chunk.id;
          return (
            <div
              key={chunk.id}
              ref={(el) => {
                chunkRefs.current[chunk.id] = el;
              }}
              className={`rounded-xl px-3 py-3 border transition-all duration-500 ${
                isFlashing
                  ? "bg-neon-teal/15 border-neon-teal/50 shadow-[0_0_20px_rgba(0,255,200,0.15)]"
                  : isHighlighted
                    ? "bg-neon-teal/8 border-neon-teal/25"
                    : "border-transparent hover:bg-white/[0.02] hover:border-white/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-mono text-white/20 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-md">
                  #{String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono text-white/25 truncate flex-1">
                  {chunk.source}
                </span>
                {isHighlighted && (
                  <span className="flex items-center gap-1 text-[9px] font-mono text-neon-teal bg-neon-teal/10 border border-neon-teal/20 px-2 py-0.5 rounded-full ml-auto">
                    <Sparkles size={7} />
                    retrieved
                  </span>
                )}
              </div>
              <p
                className={`text-[11px] leading-relaxed font-body transition-colors duration-500 ${
                  isHighlighted ? "text-white/70" : "text-white/40"
                }`}
              >
                {chunk.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-white/5 bg-white/[0.01] shrink-0">
        <p className="text-[9px] font-mono text-white/15 text-center">
          Click a retrieved chunk in the RAG panel to highlight its source
        </p>
      </div>
    </div>
  );
}
