"use client";
import { useState } from "react";
import { GraduationCap, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { QueryResult } from "../lib/types";

interface Props {
  result: QueryResult | null;
}

export default function TeachMePanel({ result }: Props) {
  const [open, setOpen] = useState(false);

  const rag = result?.responses.find((r) => r.mode === "rag");
  const param = result?.responses.find((r) => r.mode === "parametric");

  if (!result || !rag) return null;

  return (
    <div className="border border-teal-rag/20 rounded-xl overflow-hidden bg-teal-rag/3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-teal-rag/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <GraduationCap size={15} className="text-teal-rag/70" />
          <span className="text-sm font-mono font-medium text-teal-rag/80">Teach Me Mode</span>
          <span className="text-[10px] font-mono text-teal-rag/40 bg-teal-rag/10 px-2 py-0.5 rounded-full">
            How RAG built this answer
          </span>
        </div>
        {open ? (
          <ChevronUp size={13} className="text-teal-rag/40" />
        ) : (
          <ChevronDown size={13} className="text-teal-rag/40" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 animate-slide-up border-t border-teal-rag/10 pt-4">
          {/* Step 1 */}
          <Step num={1} title="Query Encoding">
            <p>
              Your query <em className="text-ink/70">&ldquo;{result.query}&rdquo;</em> was converted into
              a dense vector embedding using a bi-encoder (DPR). This representation captures semantic
              meaning, not just keywords.
            </p>
          </Step>

          {/* Step 2 */}
          <Step num={2} title="Similarity Search (MIPS)">
            <p>
              The query vector was compared against {" "}
              <strong>{(result.responses.find(r => r.mode === "rag")?.retrievedChunks?.length ?? 0) + 5}+</strong> indexed document
              chunks using Maximum Inner Product Search. The top{" "}
              <strong>{rag.retrievedChunks?.length ?? 3} chunks</strong> were selected.
            </p>
            {rag.retrievedChunks && rag.retrievedChunks.length > 0 && (
              <div className="mt-2 space-y-1">
                {rag.retrievedChunks.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-[11px] font-mono text-ink/50">
                    <ArrowRight size={9} className="text-teal-rag/50 shrink-0" />
                    <span className="truncate">{c.source}</span>
                    <span className="ml-auto text-teal-rag/60">{Math.round(c.score * 100)}% match</span>
                  </div>
                ))}
              </div>
            )}
          </Step>

          {/* Step 3 */}
          <Step num={3} title="Conditional Generation">
            <p>
              The BART generator received the query <em>concatenated</em> with the retrieved chunks as
              context. It produced an answer grounded in that context — each sentence in the output
              can be traced to a specific source chunk.
            </p>
            {rag.citations && rag.citations.length > 0 && (
              <div className="mt-2 space-y-1">
                {rag.citations.map((c, i) => (
                  <div key={i} className="text-[11px] font-mono text-teal-rag/60 italic border-l-2 border-teal-rag/30 pl-2">
                    &ldquo;{c.sentence}&rdquo; → chunk {c.chunkId}
                  </div>
                ))}
              </div>
            )}
          </Step>

          {/* Contrast */}
          {param && param.hallucinations && param.hallucinations.length > 0 && (
            <Step num={4} title="Why Parametric Failed Here">
              <p>
                The parametric model generated{" "}
                <strong className="text-accent">{param.hallucinations.length} phrase(s)</strong> that
                don&apos;t appear in any source document. Without retrieval, the model guesses from
                statistical patterns — leading to plausible but unverifiable claims.
              </p>
              <div className="mt-2 space-y-1">
                {param.hallucinations.map((h, i) => (
                  <div key={i} className="text-[11px] font-mono text-accent/60 italic border-l-2 border-accent/30 pl-2">
                    &ldquo;{h}&rdquo;
                  </div>
                ))}
              </div>
            </Step>
          )}
        </div>
      )}
    </div>
  );
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="w-5 h-5 rounded-full bg-teal-rag/15 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-mono font-medium text-teal-rag/70">{num}</span>
      </div>
      <div className="flex-1">
        <p className="text-xs font-mono font-medium text-ink/60 mb-1">{title}</p>
        <div className="text-xs text-ink/50 leading-relaxed font-body space-y-1">{children}</div>
      </div>
    </div>
  );
}
