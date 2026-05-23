"use client";
import { BookOpen, Database, Cpu } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-paper-darker bg-paper-dark/60 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink rounded-sm flex items-center justify-center">
            <BookOpen size={16} className="text-paper" />
          </div>
          <div>
            <span className="font-display font-semibold text-ink text-sm tracking-wide">
              Insight
            </span>
            <span className="font-display font-light italic text-accent text-sm ml-1">
              RAG
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-ink/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-warm/70" />
            Parametric LLM
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-ink/40" />
            Fine-tuned
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-rag" />
            RAG
          </span>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-2 text-xs font-mono text-ink/40 bg-paper-darker px-3 py-1.5 rounded-full border border-paper-darker">
          <Database size={11} />
          <span>Knowledge Base Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-rag animate-pulse" />
        </div>
      </div>
    </header>
  );
}
