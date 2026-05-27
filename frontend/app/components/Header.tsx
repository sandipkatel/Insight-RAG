"use client";
import { BookOpen, Database, Wifi } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-white/5 bg-void/80 backdrop-blur-xl sticky top-0 z-50">
      {/* Top accent bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-neon-teal via-electric-amber to-neon-teal bg-[length:200%_100%] animate-gradient-shift" />

      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-neon-teal/10 border border-neon-teal/30 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-neon-teal" />
            </div>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-neon-teal rounded-full animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-white text-lg font-bold tracking-tight">
              Insight
            </span>
            <span className="font-display text-neon-teal text-lg font-light italic">
              RAG
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full px-5 py-2">
          <LegendItem
            color="bg-amber-200"
            glow="shadow-amber-glow"
            label="Parametric LLM"
          />
          <Divider />
          <LegendItem color="bg-slate-400" label="Fine-tuned" />
          <Divider />
          <LegendItem
            color="bg-teal-500"
            glow="shadow-teal-glow"
            label="RAG"
          />
        </div>
        <div className="ml-10">
        </div>
      </div>
    </header>
  );
}

function LegendItem({
  color,
  glow,
  label,
}: {
  color: string;
  glow?: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2 px-3 text-xs font-mono text-white/40">
      <span className={`w-1.5 h-1.5 rounded-full ${color} ${glow ?? ""}`} />
      {label}
    </span>
  );
}

function Divider() {
  return <span className="w-px h-3 bg-white/10" />;
}
