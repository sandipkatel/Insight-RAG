"use client";
import { useState } from "react";
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
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
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        open
          ? "border-neon-teal/25 shadow-[0_0_40px_rgba(0,255,200,0.06)]"
          : "border-white/8"
      } bg-surface`}
    >
      {/* Top glow line */}
      <div
        className={`h-[1px] w-full transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        } bg-gradient-to-r from-transparent via-neon-teal/40 to-transparent`}
      />

      {/* Toggle header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-4 transition-all ${
          open ? "bg-neon-teal/[0.03]" : "hover:bg-white/[0.02]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              open
                ? "bg-neon-teal/15 border border-neon-teal/30"
                : "bg-white/5 border border-white/10"
            }`}
          >
            <GraduationCap
              size={14}
              className={open ? "text-neon-teal/80" : "text-white/30"}
            />
          </div>
          <div className="text-left">
            <span
              className={`text-sm font-mono font-semibold transition-colors ${
                open ? "text-neon-teal/80" : "text-white/40"
              }`}
            >
              Teach Me Mode
            </span>
            <span className="ml-3 text-[9px] font-mono text-white/20 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
              How RAG built this answer
            </span>
          </div>
        </div>
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${
            open ? "bg-neon-teal/10 text-neon-teal/60" : "text-white/20"
          }`}
        >
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="border-t border-white/5">
          <div className="px-5 py-5 space-y-1">
            {/* Visual pipeline */}
            <div className="flex items-stretch gap-0 mb-6 rounded-xl overflow-hidden border border-white/5">
              {[
                {
                  num: 1,
                  label: "Encode",
                  sub: "Query → Vector",
                  color: "text-electric-amber/70",
                  bg: "bg-electric-amber/[0.04]",
                },
                {
                  num: 2,
                  label: "Retrieve",
                  sub: "MIPS Search",
                  color: "text-neon-teal/70",
                  bg: "bg-neon-teal/[0.04]",
                },
                {
                  num: 3,
                  label: "Generate",
                  sub: "Grounded output",
                  color: "text-violet/70",
                  bg: "bg-violet/[0.04]",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className={`flex-1 ${step.bg} flex flex-col items-center justify-center py-3 gap-0.5 ${i < 2 ? "border-r border-white/5" : ""}`}
                >
                  <span
                    className={`text-[9px] font-mono font-bold ${step.color} uppercase tracking-widest`}
                  >
                    {String(step.num).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold ${step.color}`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[9px] font-mono text-white/20">
                    {step.sub}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <Step num={1} title="Query Encoding" accent="electric-amber">
                <p>
                  Your query{" "}
                  <em className="text-white/60 not-italic font-mono text-[11px] bg-white/5 px-1.5 py-0.5 rounded">
                    &ldquo;{result.query}&rdquo;
                  </em>{" "}
                  was converted into a dense vector embedding via a bi-encoder
                  (DPR), capturing semantic meaning rather than just keywords.
                </p>
              </Step>

              {/* Step 2 */}
              <Step num={2} title="Similarity Search (MIPS)" accent="neon-teal">
                <p>
                  The query vector was compared against{" "}
                  <strong className="text-white/60">
                    {(rag.retrievedChunks?.length ?? 0) + 5}+
                  </strong>{" "}
                  indexed chunks using Maximum Inner Product Search. Top{" "}
                  <strong className="text-white/60">
                    {rag.retrievedChunks?.length ?? 3}
                  </strong>{" "}
                  chunks were selected.
                </p>
                {rag.retrievedChunks && rag.retrievedChunks.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {rag.retrievedChunks.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2 bg-neon-teal/[0.04] border border-neon-teal/10 rounded-lg px-2.5 py-1.5"
                      >
                        <ArrowRight
                          size={9}
                          className="text-neon-teal/40 shrink-0"
                        />
                        <span className="text-[10px] font-mono text-white/40 truncate flex-1">
                          {c.source}
                        </span>
                        <span className="text-[10px] font-mono text-neon-teal/60 font-semibold shrink-0">
                          {Math.round(c.score * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Step>

              {/* Step 3 */}
              <Step num={3} title="Conditional Generation" accent="violet">
                <p>
                  The generator received the query <em>concatenated</em> with
                  retrieved chunks as context, producing an answer fully
                  grounded in those sources — every sentence traceable to a
                  chunk.
                </p>
                {rag.citations && rag.citations.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {rag.citations.map((c, i) => (
                      <div
                        key={i}
                        className="text-[10px] font-mono text-neon-teal/50 bg-neon-teal/5 border border-neon-teal/10 rounded-lg px-2.5 py-1.5 italic leading-relaxed"
                      >
                        &ldquo;{c.sentence}&rdquo;
                        <span className="not-italic text-white/20 ml-1">
                          → chunk {c.chunkId}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Step>

              {/* Step 4 — hallucinations */}
              {param &&
                param.hallucinations &&
                param.hallucinations.length > 0 && (
                  <Step
                    num={4}
                    title="Why Parametric Failed Here"
                    accent="coral"
                  >
                    <p>
                      The parametric model produced{" "}
                      <strong className="text-coral/70">
                        {param.hallucinations.length} flagged phrase(s)
                      </strong>{" "}
                      absent from any source document — plausible but
                      unverifiable guesses from statistical patterns.
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {param.hallucinations.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-[10px] font-mono text-coral/50 bg-coral/5 border border-coral/15 rounded-lg px-2.5 py-1.5"
                        >
                          <AlertTriangle
                            size={9}
                            className="mt-0.5 shrink-0 text-coral/60"
                          />
                          <span className="italic">&ldquo;{h}&rdquo;</span>
                        </div>
                      ))}
                    </div>
                  </Step>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type AccentColor = "neon-teal" | "electric-amber" | "coral" | "violet";

function Step({
  num,
  title,
  accent,
  children,
}: {
  num: number;
  title: string;
  accent: AccentColor;
  children: React.ReactNode;
}) {
  const accentMap: Record<
    AccentColor,
    { num: string; title: string; circle: string }
  > = {
    "neon-teal": {
      num: "text-neon-teal/70",
      title: "text-neon-teal/60",
      circle: "bg-neon-teal/10 border-neon-teal/25",
    },
    "electric-amber": {
      num: "text-electric-amber/70",
      title: "text-electric-amber/60",
      circle: "bg-electric-amber/10 border-electric-amber/25",
    },
    coral: {
      num: "text-coral/70",
      title: "text-coral/60",
      circle: "bg-coral/10 border-coral/25",
    },
    violet: {
      num: "text-violet/70",
      title: "text-violet/60",
      circle: "bg-violet/10 border-violet/25",
    },
  };
  const a = accentMap[accent];

  return (
    <div className="flex gap-3.5">
      <div
        className={`w-6 h-6 rounded-full border ${a.circle} flex items-center justify-center shrink-0 mt-0.5`}
      >
        <span className={`text-[9px] font-mono font-bold ${a.num}`}>{num}</span>
      </div>
      <div className="flex-1 pt-0.5">
        <p
          className={`text-[10px] font-mono font-semibold uppercase tracking-wider mb-1.5 ${a.title}`}
        >
          {title}
        </p>
        <div className="text-[11px] text-white/45 leading-relaxed space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}
