"use client";
import { useEffect, useRef, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { Chunk, Document } from "../lib/types";

interface Props {
  document: Document;
  highlightedChunkId: string | null;
  onClose?: () => void;
}

export default function SourcePanel({ document, highlightedChunkId, onClose }: Props) {
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
    <div className="flex flex-col h-full bg-white border border-paper-darker rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-paper-darker bg-paper-dark/30 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={13} className="text-ink/40 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-mono font-medium text-ink/60 truncate">
              {document.title}
            </p>
            <p className="text-[10px] font-mono text-ink/30">
              {document.chunks.length} indexed chunks
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-ink/25 hover:text-ink/50 transition-colors ml-2 shrink-0"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
        {document.chunks.map((chunk, i) => {
          const isHighlighted = highlightedChunkId === chunk.id;
          const wasHighlighted = justHighlighted === chunk.id;
          return (
            <div
              key={chunk.id}
              ref={(el) => { chunkRefs.current[chunk.id] = el; }}
              className={`rounded-lg px-3 py-2.5 transition-all duration-500 ${
                wasHighlighted
                  ? "bg-accent/15 border border-accent/30 highlight-pulse"
                  : isHighlighted
                  ? "bg-teal-rag/10 border border-teal-rag/25"
                  : "hover:bg-paper/60 border border-transparent"
              }`}
            >
              {/* Chunk meta */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono text-ink/25 bg-paper-darker px-1.5 py-0.5 rounded">
                  #{i + 1}
                </span>
                <span className="text-[9px] font-mono text-ink/30 truncate">
                  {chunk.source}
                </span>
                {isHighlighted && (
                  <span className="ml-auto text-[9px] font-mono text-teal-rag bg-teal-rag/10 px-1.5 py-0.5 rounded-full">
                    retrieved
                  </span>
                )}
              </div>
              {/* Chunk text */}
              <p className="text-[12px] leading-relaxed text-ink/65 font-body">
                {chunk.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2.5 border-t border-paper-darker bg-paper-dark/20 shrink-0">
        <p className="text-[10px] font-mono text-ink/25 text-center">
          Click a retrieved chunk in the RAG panel to highlight its source here
        </p>
      </div>
    </div>
  );
}
