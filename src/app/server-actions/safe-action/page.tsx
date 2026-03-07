"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { addToCartAction, submitContactAction } from "./actions";
import Link from "next/link";

export default function SafeActionPage() {
  const [results, setResults] = useState<string[]>([]);

  const { execute: executeAddToCart, status: cartStatus } = useAction(addToCartAction, {
    onSuccess: ({ data }) => {
      setResults((prev) => [...prev, `[next-safe-action] Cart success: ${JSON.stringify(data)}`]);
    },
    onError: ({ error }) => {
      setResults((prev) => [...prev, `[next-safe-action] Cart error: ${JSON.stringify(error)}`]);
    },
  });

  const { execute: executeContact, status: contactStatus } = useAction(submitContactAction, {
    onSuccess: ({ data }) => {
      setResults((prev) => [...prev, `[next-safe-action] Contact success: ${JSON.stringify(data)}`]);
    },
    onError: ({ error }) => {
      setResults((prev) => [...prev, `[next-safe-action] Contact error: ${JSON.stringify(error)}`]);
    },
  });

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test 4a: next-safe-action</h1>
        <Link href="/server-actions/self-rolled" className="text-blue-600 hover:underline text-sm">
          Switch to Self-Rolled →
        </Link>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded p-3 text-sm">
        <strong>Implementation:</strong> next-safe-action library
        <br />
        <strong>Features:</strong> Type-safe client, useAction hook, auto status tracking, onSuccess/onError callbacks
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Add to Cart (Valid Input)</h2>
        <button
          onClick={() => executeAddToCart({ productId: "prod-123", quantity: 2, date: "2026-03-15" })}
          disabled={cartStatus === "executing"}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {cartStatus === "executing" ? "Adding..." : "Add to Cart"}
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Add to Cart (Invalid Input)</h2>
        <button
          onClick={() => executeAddToCart({ productId: "", quantity: -1, date: "bad-date" })}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Submit Invalid Data
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Contact Form (No Auth)</h2>
        <button
          onClick={() => executeContact({ name: "John", email: "john@test.com", message: "Hello, I have a question about my order" })}
          disabled={contactStatus === "executing"}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {contactStatus === "executing" ? "Submitting..." : "Submit Contact"}
        </button>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Results Log</h2>
        <div className="bg-gray-50 border rounded p-3 min-h-32 max-h-64 overflow-auto">
          {results.length === 0 ? (
            <p className="text-gray-400 text-sm">Click buttons above to see results...</p>
          ) : (
            results.map((r, i) => (
              <pre key={i} className="text-xs mb-1 whitespace-pre-wrap">{r}</pre>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
