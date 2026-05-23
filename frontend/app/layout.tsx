import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsightRAG — Compare LLM vs Fine-tuned vs RAG",
  description: "Side-by-side comparison of Parametric LLM, Fine-tuned, and RAG responses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
