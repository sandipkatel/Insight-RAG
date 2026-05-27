"use client";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
  Layers,
} from "lucide-react";
import { Mode, ModelResponse, Chunk } from "../lib/types";

interface Props {
  response: ModelResponse | null;
  isLoading: boolean;
  onChunkClick?: (chunk: Chunk) => void;
  highlightedChunkId?: string | null;
}

const MODE_CONFIG: Record<
  Mode,
  {
    label: string;
    sublabel: string;
    accent: string;
    border: string;
    headerBg: string;
    dot: string;
    glow: string;
    badge: string;
  }
> = {
  parametric: {
    label: "Parametric LLM",
    sublabel: "No retrieval · Parameters only",
    accent: "text-electric-amber",
    border: "border-electric-amber/20",
    headerBg: "bg-electric-amber/[0.04]",
    dot: "bg-electric-amber",
    glow: "shadow-[0_0_20px_rgba(255,176,0,0.08)]",
    badge: "bg-electric-amber/10 text-electric-amber border-electric-amber/20",
  },
  finetuned: {
    label: "Fine-tuned LLM",
    sublabel: "Domain-adapted · Static knowledge",
    accent: "text-slate-400",
    border: "border-white/8",
    headerBg: "bg-white/[0.02]",
    dot: "bg-slate-400",
    glow: "",
    badge: "bg-slate-700/40 text-slate-400 border-slate-600/30",
  },
  rag: {
    label: "RAG",
    sublabel: "Retrieved + generated · Grounded",
    accent: "text-neon-teal",
    border: "border-neon-teal/25",
    headerBg: "bg-neon-teal/[0.04]",
    dot: "bg-neon-teal",
    glow: "shadow-[0_0_30px_rgba(0,255,200,0.07)]",
    badge: "bg-neon-teal/10 text-neon-teal border-neon-teal/20",
  },
};

function TypingIndicator({ mode }: { mode: Mode }) {
  const cfg = MODE_CONFIG[mode];
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${cfg.dot} opacity-60`}
              style={{
                animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-white/25">
          Generating response…
        </span>
      </div>
      {/* Skeleton lines */}
      <div className="space-y-2">
        {[85, 70, 90, 55].map((w, i) => (
          <div
            key={i}
            className="h-2.5 rounded-full bg-white/5 animate-pulse"
            style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function ConfidenceBar({ value, mode }: { value: number; mode: Mode }) {
  const cfg = MODE_CONFIG[mode];
  const barColor =
    value >= 80 ? cfg.dot : value >= 50 ? "bg-electric-amber" : "bg-coral";
  const glowColor =
    value >= 80 && mode === "rag" ? "shadow-[0_0_8px_rgba(0,255,200,0.4)]" : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">
          Confidence
        </span>
        <span className={`text-xs font-mono font-bold ${cfg.accent}`}>
          {value}%
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor} ${glowColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function AnswerText({
  text,
  hallucinations,
}: {
  text: string;
  hallucinations?: string[];
}) {
  if (!hallucinations || hallucinations.length === 0) {
    return (
      <p
        className="text-sm leading-relaxed text-white/70 font-body whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
      />
    );
  }

  let rendered = text;
  hallucinations.forEach((h) => {
    rendered = rendered.replace(
      h,
      `<mark class="bg-coral/20 text-coral/90 border-b border-coral/50 not-italic rounded px-0.5" title="Possible hallucination">${h}</mark>`,
    );
  });

  return (
    <div className="space-y-3">
      <p
        className="text-sm leading-relaxed text-white/70 font-body whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(rendered) }}
      />
      {hallucinations.length > 0 && (
        <div className="flex items-start gap-2 text-[11px] font-mono text-coral/70 bg-coral/5 border border-coral/15 rounded-lg px-3 py-2">
          <AlertTriangle size={11} className="mt-0.5 shrink-0 text-coral" />
          <span>
            {hallucinations.length} phrase(s) flagged — not found in knowledge
            base
          </span>
        </div>
      )}
    </div>
  );
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white/90'>$1</strong>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default function ResponseCard({
  response,
  isLoading,
  onChunkClick,
  highlightedChunkId,
}: Props) {
  const [chunksOpen, setChunksOpen] = useState(false);
  const mode = response?.mode ?? "parametric";
  const cfg = MODE_CONFIG[mode];

  return (
    <div
      className={`flex flex-col rounded-2xl border ${cfg.border} ${cfg.glow} bg-surface overflow-hidden transition-all duration-300 hover:border-opacity-40`}
    >
      {/* Top accent line */}
      <div
        className={`h-[1px] w-full ${
          mode === "parametric"
            ? "bg-gradient-to-r from-transparent via-electric-amber/50 to-transparent"
            : mode === "rag"
              ? "bg-gradient-to-r from-transparent via-neon-teal/50 to-transparent"
              : "bg-gradient-to-r from-transparent via-slate-500/30 to-transparent"
        }`}
      />

      {/* Header */}
      <div
        className={`px-4 pt-3.5 pb-3 border-b border-white/5 ${cfg.headerBg}`}
      >
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-2 h-2 rounded-full ${cfg.dot} ${mode !== "finetuned" ? "shadow-[0_0_6px_currentColor]" : ""}`}
            />
            <span className={`text-xs font-mono font-semibold ${cfg.accent}`}>
              {cfg.label}
            </span>
          </div>
          {response?.latencyMs && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-white/20 bg-white/5 px-2 py-0.5 rounded-full">
              <Clock size={8} />
              {(response.latencyMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
        <p className="text-[10px] font-mono text-white/25 ml-[18px]">
          {cfg.sublabel}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {isLoading ? (
          <TypingIndicator mode={mode} />
        ) : response ? (
          <>
            <AnswerText
              text={response.answer}
              hallucinations={response.hallucinations}
            />

            {/* Citations */}
            {response.citations && response.citations.length > 0 && (
              <div className="space-y-2">
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  Cited sources
                </p>
                {response.citations.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-[11px] font-mono text-neon-teal/60 bg-neon-teal/5 rounded-lg px-3 py-2 border border-neon-teal/10"
                  >
                    <CheckCircle
                      size={10}
                      className="mt-0.5 shrink-0 text-neon-teal/70"
                    />
                    <span className="italic leading-relaxed">
                      &ldquo;{c.sentence}&rdquo;
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Confidence */}
            {response.confidence !== undefined && (
              <ConfidenceBar value={response.confidence} mode={mode} />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div
              className={`w-8 h-8 rounded-full border ${cfg.border} flex items-center justify-center`}
            >
              <div className={`w-2 h-2 rounded-full ${cfg.dot} opacity-30`} />
            </div>
            <p className="text-[11px] font-mono text-white/15 italic">
              Waiting for query…
            </p>
          </div>
        )}
      </div>

      {/* Retrieved chunks */}
      {response?.retrievedChunks && response.retrievedChunks.length > 0 && (
        <div className="border-t border-neon-teal/10">
          <button
            onClick={() => setChunksOpen(!chunksOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-mono text-neon-teal/40 hover:text-neon-teal hover:bg-neon-teal/5 transition-all"
          >
            <span className="flex items-center gap-1.5">
              <Layers size={10} />
              {response.retrievedChunks.length} chunks retrieved
            </span>
            {chunksOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>

          {chunksOpen && (
            <div className="px-3 pb-3 space-y-2">
              {response.retrievedChunks.map((chunk) => (
                <button
                  key={chunk.id}
                  onClick={() => onChunkClick?.(chunk)}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all group ${
                    highlightedChunkId === chunk.id
                      ? "border-neon-teal/40 bg-neon-teal/10 shadow-[0_0_15px_rgba(0,255,200,0.1)]"
                      : "border-white/5 bg-white/[0.02] hover:border-neon-teal/20 hover:bg-neon-teal/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-neon-teal/50 flex items-center gap-1">
                      <FileText size={9} />
                      {chunk.source} · p.{chunk.page}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-10 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neon-teal/50 rounded-full"
                          style={{ width: `${chunk.score * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-white/25">
                        {Math.round(chunk.score * 100)}%
                      </span>
                      <ExternalLink
                        size={9}
                        className="text-white/15 group-hover:text-neon-teal transition-colors"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">
                    {chunk.text}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
