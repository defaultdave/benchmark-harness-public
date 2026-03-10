import fs from "fs";
import path from "path";
import Link from "next/link";
import { Markdown } from "@/components/markdown";

export default function ArticlePage() {
  const content = fs.readFileSync(
    path.join(process.cwd(), "docs", "article.md"),
    "utf-8"
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-blue-600 hover:underline mb-8 inline-block"
      >
        &larr; Back to benchmark harness
      </Link>
      <Markdown content={content} />
    </main>
  );
}
