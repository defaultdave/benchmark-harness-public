"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { isStaticExport, mockAddToCart, mockSubmitContact } from "@/lib/mock-actions";

// Conditionally import server action hooks — only available with a server
let useActionHook: typeof import("next-safe-action/hooks").useAction | null = null;
let serverActions: {
  addToCartAction: Parameters<NonNullable<typeof useActionHook>>[0];
  submitContactAction: Parameters<NonNullable<typeof useActionHook>>[0];
} | null = null;

if (!isStaticExport) {
  // Dynamic requires won't work in static export, but that's fine —
  // the isStaticExport guard ensures this branch is dead-code-eliminated
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    useActionHook = require("next-safe-action/hooks").useAction;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    serverActions = require("./actions");
  } catch {
    // Server actions not available — fall through to static mode
  }
}

function ServerActionControls({ onResult }: { onResult: (msg: string) => void }) {
  if (!useActionHook || !serverActions) return null;

  const useAction = useActionHook;
  const { addToCartAction, submitContactAction } = serverActions;

  /* eslint-disable react-hooks/rules-of-hooks */
  const { execute: executeAddToCart, status: cartStatus } = useAction(addToCartAction, {
    onSuccess: ({ data }) => onResult(`[next-safe-action] Cart success: ${JSON.stringify(data)}`),
    onError: ({ error }) => onResult(`[next-safe-action] Cart error: ${JSON.stringify(error)}`),
  });

  const { execute: executeContact, status: contactStatus } = useAction(submitContactAction, {
    onSuccess: ({ data }) => onResult(`[next-safe-action] Contact success: ${JSON.stringify(data)}`),
    onError: ({ error }) => onResult(`[next-safe-action] Contact error: ${JSON.stringify(error)}`),
  });
  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <>
      <ActionButtons
        onAddToCart={(input) => executeAddToCart(input)}
        onInvalidCart={(input) => executeAddToCart(input)}
        onContact={(input) => executeContact(input)}
        cartPending={cartStatus === "executing"}
        contactPending={contactStatus === "executing"}
      />
    </>
  );
}

function StaticControls({ onResult }: { onResult: (msg: string) => void }) {
  const [cartPending, startCart] = useTransition();
  const [contactPending, startContact] = useTransition();

  return (
    <ActionButtons
      onAddToCart={(input) => startCart(async () => {
        const result = await mockAddToCart(input);
        onResult(`[mock] Cart result: ${JSON.stringify(result)}`);
      })}
      onInvalidCart={(input) => startCart(async () => {
        const result = await mockAddToCart(input);
        onResult(`[mock] Cart result: ${JSON.stringify(result)}`);
      })}
      onContact={(input) => startContact(async () => {
        const result = await mockSubmitContact(input);
        onResult(`[mock] Contact result: ${JSON.stringify(result)}`);
      })}
      cartPending={cartPending}
      contactPending={contactPending}
    />
  );
}

function ActionButtons({
  onAddToCart,
  onInvalidCart,
  onContact,
  cartPending,
  contactPending,
}: {
  onAddToCart: (input: Record<string, unknown>) => void;
  onInvalidCart: (input: Record<string, unknown>) => void;
  onContact: (input: Record<string, unknown>) => void;
  cartPending: boolean;
  contactPending: boolean;
}) {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Add to Cart (Valid Input)</h2>
        <button
          onClick={() => onAddToCart({ productId: "prod-123", quantity: 2, date: "2026-03-15" })}
          disabled={cartPending}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {cartPending ? "Adding..." : "Add to Cart"}
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Add to Cart (Invalid Input)</h2>
        <button
          onClick={() => onInvalidCart({ productId: "", quantity: -1, date: "bad-date" })}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Submit Invalid Data
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Contact Form (No Auth)</h2>
        <button
          onClick={() => onContact({ name: "John", email: "john@test.com", message: "Hello, I have a question about my order" })}
          disabled={contactPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {contactPending ? "Submitting..." : "Submit Contact"}
        </button>
      </section>
    </>
  );
}

export default function SafeActionPage() {
  const [results, setResults] = useState<string[]>([]);
  const addResult = (msg: string) => setResults((prev) => [...prev, msg]);

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
        {isStaticExport && (
          <>
            <br />
            <span className="text-orange-600 font-medium">Static mode — using client-side mock actions (same validation logic)</span>
          </>
        )}
      </div>

      {isStaticExport ? (
        <StaticControls onResult={addResult} />
      ) : (
        <ServerActionControls onResult={addResult} />
      )}

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
