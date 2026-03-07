"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { isStaticExport, mockAddToCart, mockSubmitContact } from "@/lib/mock-actions";

// In static mode, server actions aren't available — use mocks instead
let addToCartAction: (input: Record<string, unknown>) => Promise<unknown>;
let submitContactAction: (input: Record<string, unknown>) => Promise<unknown>;

if (isStaticExport) {
  addToCartAction = mockAddToCart;
  submitContactAction = mockSubmitContact;
} else {
  // Dynamic require for server actions — eliminated in static builds
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const actions = require("./actions");
    addToCartAction = actions.addToCartAction;
    submitContactAction = actions.submitContactAction;
  } catch {
    addToCartAction = mockAddToCart;
    submitContactAction = mockSubmitContact;
  }
}

export default function SelfRolledActionsPage() {
  const [results, setResults] = useState<string[]>([]);
  const [cartPending, startCartTransition] = useTransition();
  const [contactPending, startContactTransition] = useTransition();

  const prefix = isStaticExport ? "[mock]" : "[self-rolled]";

  const handleAddToCart = (input: Record<string, unknown>) => {
    startCartTransition(async () => {
      const result = await addToCartAction(input);
      setResults((prev) => [...prev, `${prefix} Cart result: ${JSON.stringify(result)}`]);
    });
  };

  const handleContact = (input: Record<string, unknown>) => {
    startContactTransition(async () => {
      const result = await submitContactAction(input);
      setResults((prev) => [...prev, `${prefix} Contact result: ${JSON.stringify(result)}`]);
    });
  };

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test 4b: Self-Rolled Actions</h1>
        <Link href="/server-actions/safe-action" className="text-blue-600 hover:underline text-sm">
          ← Switch to next-safe-action
        </Link>
      </div>

      <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
        <strong>Implementation:</strong> Self-rolled (~200 lines)
        <br />
        <strong>Features:</strong> createAction/createAuthAction, Zod validation, unified result type, auth middleware
        <br />
        <strong>Missing vs library:</strong> No useAction hook (using useTransition), no auto status tracking, no bind args
        {isStaticExport && (
          <>
            <br />
            <span className="text-orange-600 font-medium">Static mode — using client-side mock actions (same validation logic)</span>
          </>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Add to Cart (Valid Input)</h2>
        <button
          onClick={() => handleAddToCart({ productId: "prod-123", quantity: 2, date: "2026-03-15" })}
          disabled={cartPending}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {cartPending ? "Adding..." : "Add to Cart"}
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Add to Cart (Invalid Input)</h2>
        <button
          onClick={() => handleAddToCart({ productId: "", quantity: -1, date: "bad-date" })}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Submit Invalid Data
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Contact Form (No Auth)</h2>
        <button
          onClick={() => handleContact({ name: "John", email: "john@test.com", message: "Hello, I have a question about my order" })}
          disabled={contactPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {contactPending ? "Submitting..." : "Submit Contact"}
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

      <section className="bg-gray-50 rounded p-3 text-sm">
        <strong>Comparison notes:</strong>
        <ul className="list-disc ml-5 mt-1 space-y-1">
          <li>Self-rolled uses useTransition for pending state (native React 19)</li>
          <li>next-safe-action provides useAction hook with status, onSuccess, onError callbacks</li>
          <li>Both validate with Zod, both handle auth — self-rolled is ~200 lines vs. library dependency</li>
          <li>Self-rolled returns a discriminated union (success/validationErrors/serverError)</li>
        </ul>
      </section>
    </main>
  );
}
