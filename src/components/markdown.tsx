"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ content }: { content: string }) {
  return (
    <article className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 prose-img:rounded-lg prose-img:border prose-table:text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
