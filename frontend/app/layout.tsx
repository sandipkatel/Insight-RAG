import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next/types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InsightRAG — Compare LLM vs Fine-tuned vs RAG",
  description:
    "Side-by-side comparison of Parametric LLM, Fine-tuned, and RAG responses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
