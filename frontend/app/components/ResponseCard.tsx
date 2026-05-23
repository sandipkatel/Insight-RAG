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
  { label: string; sublabel: string; color: string; border: string; dot: string; bg: string }
> = {
  parametric: {
    label: "Parametric LLM",
    sublabel: "No retrieval · Parameters only",
    color: "text-amber-warm",
    border: "border-amber-warm/20",
    dot: "bg-amber-warm",
    bg: "bg-amber-warm/5",
  },
  finetuned: {
    label: "Fine-tuned LLM",
    sublabel: "Domain-adapted · Static knowledge",
    color: "text-ink/50",
    border: "border-ink/10",
    dot: "bg-ink/35",
    bg: "bg-ink/[0.02]",
  },
  rag: {
    label: "RAG",
    sublabel: "Retrieved + generated · Grounded",
    color: "text-teal-rag",
    border: "border-teal-rag/25",
    dot: "bg-teal-rag",
    bg: "bg-teal-rag/5",
  },
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="flex gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span className="text-xs font-mono text-ink/30">Generating response</span>
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 80 ? "bg-teal-rag" : value >= 50 ? "bg-amber-warm" : "bg-accent";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-paper-darker rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-ink/40 w-8 text-right">{value}%</span>
    </div>
  );
}

function AnswerText({ text, hallucinations }: { text: string; hallucinations?: string[] }) {
  if (!hallucinations || hallucinations.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-ink/80 whitespace-pre-wrap font-body"
         dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
    );
  }

  let rendered = text;
  hallucinations.forEach((h) => {
    rendered = rendered.replace(
      h,
      `<mark class="bg-accent/15 text-accent border-b border-accent/40 not-italic" title="Possible hallucination">${h}</mark>`
    );
  });

  return (
    <div>
      <p
        className="text-sm leading-relaxed text-ink/80 whitespace-pre-wrap font-body"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(rendered) }}
      />
      {hallucinations.length > 0 && (
        <div className="mt-2 flex items-start gap-1.5 text-[11px] font-mono text-accent/70 bg-accent/5 rounded px-2 py-1.5">
          <AlertTriangle size={11} className="mt-0.5 shrink-0" />
          <span>{hallucinations.length} phrase(s) flagged as potentially hallucinated — not found in knowledge base</span>
        </div>
      )}
    </div>
  );
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default function ResponseCard({ response, isLoading, onChunkClick, highlightedChunkId }: Props) {
  const [chunksOpen, setChunksOpen] = useState(false);

  const mode = response?.mode ?? "parametric";
  const cfg = MODE_CONFIG[mode];

  return (
    <div
      className={`flex flex-col rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden transition-all duration-300`}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 border-b border-inherit">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
            <span className={`text-xs font-mono font-medium ${cfg.color}`}>{cfg.label}</span>
          </div>
          {response?.latencyMs && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-ink/25">
              <Clock size={9} />
              {(response.latencyMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
        <p className="text-[10px] font-mono text-ink/30 mt-0.5 ml-4">{cfg.sublabel}</p>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {isLoading ? (
          <TypingIndicator />
        ) : response ? (
          <>
            <AnswerText text={response.answer} hallucinations={response.hallucinations} />

            {/* Citations (RAG only) */}
            {response.citations && response.citations.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-mono text-ink/30 uppercase tracking-widest">Sources cited</p>
                {response.citations.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-[11px] font-mono text-teal-rag/70 bg-teal-rag/5 rounded px-2 py-1.5 border border-teal-rag/10"
                  >
                    <CheckCircle size={10} className="mt-0.5 shrink-0 text-teal-rag" />
                    <span className="italic">&ldquo;{c.sentence}&rdquo;</span>
                  </div>
                ))}
              </div>
            )}

            {/* Confidence */}
            {response.confidence !== undefined && (
              <div>
                <p className="text-[10px] font-mono text-ink/30 uppercase tracking-widest mb-1">
                  Confidence
                </p>
                <ConfidenceBar value={response.confidence} />
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-ink/20 font-mono italic">Waiting for query…</p>
        )}
      </div>

      {/* Retrieved chunks (RAG only) */}
      {response?.retrievedChunks && response.retrievedChunks.length > 0 && (
        <div className="border-t border-teal-rag/15">
          <button
            onClick={() => setChunksOpen(!chunksOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-mono text-teal-rag/60 hover:text-teal-rag hover:bg-teal-rag/5 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Layers size={10} />
              {response.retrievedChunks.length} chunks retrieved
            </span>
            {chunksOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          {chunksOpen && (
            <div className="px-3 pb-3 space-y-2">
              {response.retrievedChunks.map((chunk) => (
                <button
                  key={chunk.id}
                  onClick={() => onChunkClick?.(chunk)}
                  className={`w-full text-left rounded-lg border px-3 py-2.5 transition-all group ${
                    highlightedChunkId === chunk.id
                      ? "border-teal-rag/40 bg-teal-rag/10"
                      : "border-paper-darker bg-white/60 hover:border-teal-rag/20 hover:bg-teal-rag/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-teal-rag/60 flex items-center gap-1">
                      <FileText size={9} />
                      {chunk.source} · p.{chunk.page}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-12 bg-paper-darker rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-rag/50 rounded-full"
                          style={{ width: `${chunk.score * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-ink/30">
                        {Math.round(chunk.score * 100)}%
                      </span>
                      <ExternalLink size={9} className="text-ink/20 group-hover:text-teal-rag transition-colors" />
                    </div>
                  </div>
                  <p className="text-[11px] text-ink/50 leading-relaxed line-clamp-2">
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
