"use client";

import { useState, useCallback } from "react";
import { z } from "zod";
import * as v from "valibot";
import {
  loginSchemaZod,
  searchParamsSchemaZod,
  addToCartSchemaZod,
  bookingSchemaZod,
} from "@/lib/schemas/zod-schemas";
import {
  loginSchemaValibot,
  searchParamsSchemaValibot,
  addToCartSchemaValibot,
  bookingSchemaValibot,
} from "@/lib/schemas/valibot-schemas";
import {
  validationSpeed,
  schemaCreationSpeed,
  bundleSizes,
} from "@/lib/benchmark-data";
import { ComparisonBarChart, HorizontalBarChart } from "@/components/charts";
import Link from "next/link";

interface BenchmarkResult {
  name: string;
  zodMs: number;
  valibotMs: number;
  ratio: string;
  winner: "zod" | "valibot" | "tie";
}

// Test data
const validLogin = { email: "test@example.com", password: "password123" };
const invalidLogin = { email: "not-an-email", password: "short" };

const validSearch = {
  location: "Miami",
  date: "2026-03-15",
  minPrice: 50,
  maxPrice: 300,
  category: "bits" as const,
  features: ["wifi", "parking"],
  rating: 4,
  sort: "price" as const,
  page: 1,
};

const validCart = {
  productId: "prod-123",
  quantity: 2,
  timeSlot: "10:00 AM",
  date: "2026-03-15",
};

const validBooking = {
  guestDetails: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
    country: "US",
  },
  paymentMethod: "card" as const,
  specialRequests: "Late checkout please",
  agreeToTerms: true as const,
  promoCode: "SAVE10",
};

function benchmark(fn: () => void, iterations: number): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  return performance.now() - start;
}

export default function ValidationPage() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [schemaCreationResults, setSchemaCreationResults] = useState<BenchmarkResult[]>([]);
  const [running, setRunning] = useState(false);
  const [errorComparison, setErrorComparison] = useState<{zodErrors: string; valibotErrors: string} | null>(null);

  const ITERATIONS = 10000;
  const SCHEMA_ITERATIONS = 5000;

  const runBenchmarks = useCallback(() => {
    setRunning(true);

    setTimeout(() => {
      const validationResults: BenchmarkResult[] = [];

      const zodLoginValid = benchmark(() => loginSchemaZod.safeParse(validLogin), ITERATIONS);
      const valLoginValid = benchmark(() => v.safeParse(loginSchemaValibot, validLogin), ITERATIONS);
      validationResults.push({
        name: "Login (valid input)",
        zodMs: zodLoginValid,
        valibotMs: valLoginValid,
        ratio: (zodLoginValid / valLoginValid).toFixed(2) + "x",
        winner: zodLoginValid < valLoginValid ? "zod" : "valibot",
      });

      const zodLoginInvalid = benchmark(() => loginSchemaZod.safeParse(invalidLogin), ITERATIONS);
      const valLoginInvalid = benchmark(() => v.safeParse(loginSchemaValibot, invalidLogin), ITERATIONS);
      validationResults.push({
        name: "Login (invalid input)",
        zodMs: zodLoginInvalid,
        valibotMs: valLoginInvalid,
        ratio: (zodLoginInvalid / valLoginInvalid).toFixed(2) + "x",
        winner: zodLoginInvalid < valLoginInvalid ? "zod" : "valibot",
      });

      const zodSearch = benchmark(() => searchParamsSchemaZod.safeParse(validSearch), ITERATIONS);
      const valSearch = benchmark(() => v.safeParse(searchParamsSchemaValibot, validSearch), ITERATIONS);
      validationResults.push({
        name: "Search params (9 fields)",
        zodMs: zodSearch,
        valibotMs: valSearch,
        ratio: (zodSearch / valSearch).toFixed(2) + "x",
        winner: zodSearch < valSearch ? "zod" : "valibot",
      });

      const zodCart = benchmark(() => addToCartSchemaZod.safeParse(validCart), ITERATIONS);
      const valCart = benchmark(() => v.safeParse(addToCartSchemaValibot, validCart), ITERATIONS);
      validationResults.push({
        name: "Cart mutation (4 fields)",
        zodMs: zodCart,
        valibotMs: valCart,
        ratio: (zodCart / valCart).toFixed(2) + "x",
        winner: zodCart < valCart ? "zod" : "valibot",
      });

      const zodBooking = benchmark(() => bookingSchemaZod.safeParse(validBooking), ITERATIONS);
      const valBooking = benchmark(() => v.safeParse(bookingSchemaValibot, validBooking), ITERATIONS);
      validationResults.push({
        name: "Order (nested, 10+ fields)",
        zodMs: zodBooking,
        valibotMs: valBooking,
        ratio: (zodBooking / valBooking).toFixed(2) + "x",
        winner: zodBooking < valBooking ? "zod" : "valibot",
      });

      setResults(validationResults);

      const creationResults: BenchmarkResult[] = [];

      const zodCreate = benchmark(() => {
        z.object({
          email: z.string().email(),
          password: z.string().min(8),
        });
      }, SCHEMA_ITERATIONS);
      const valCreate = benchmark(() => {
        v.object({
          email: v.pipe(v.string(), v.email()),
          password: v.pipe(v.string(), v.minLength(8)),
        });
      }, SCHEMA_ITERATIONS);
      creationResults.push({
        name: "Simple schema creation",
        zodMs: zodCreate,
        valibotMs: valCreate,
        ratio: (zodCreate / valCreate).toFixed(2) + "x",
        winner: zodCreate < valCreate ? "zod" : "valibot",
      });

      const zodCreateComplex = benchmark(() => {
        z.object({
          customer: z.object({
            name: z.string().min(1),
            email: z.string().email(),
            phone: z.string().min(10),
          }),
          items: z.array(z.object({
            id: z.string(),
            qty: z.number().int().min(1).max(20),
          })),
          payment: z.enum(["card", "apple_pay"]),
          agree: z.literal(true),
        });
      }, SCHEMA_ITERATIONS);
      const valCreateComplex = benchmark(() => {
        v.object({
          customer: v.object({
            name: v.pipe(v.string(), v.minLength(1)),
            email: v.pipe(v.string(), v.email()),
            phone: v.pipe(v.string(), v.minLength(10)),
          }),
          items: v.array(v.object({
            id: v.string(),
            qty: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(20)),
          })),
          payment: v.picklist(["card", "apple_pay"]),
          agree: v.literal(true),
        });
      }, SCHEMA_ITERATIONS);
      creationResults.push({
        name: "Complex schema creation",
        zodMs: zodCreateComplex,
        valibotMs: valCreateComplex,
        ratio: (zodCreateComplex / valCreateComplex).toFixed(2) + "x",
        winner: zodCreateComplex < valCreateComplex ? "zod" : "valibot",
      });

      setSchemaCreationResults(creationResults);

      const zodResult = loginSchemaZod.safeParse(invalidLogin);
      const valResult = v.safeParse(loginSchemaValibot, invalidLogin);
      setErrorComparison({
        zodErrors: JSON.stringify(zodResult.success ? {} : zodResult.error.issues, null, 2),
        valibotErrors: JSON.stringify(valResult.success ? {} : valResult.issues, null, 2),
      });

      setRunning(false);
    }, 50);
  }, []);

  const validationBundles = bundleSizes.filter((b) =>
    ["Zod (full)", "@zod/mini", "Valibot"].includes(b.library)
  );

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Test 2: Zod vs Valibot</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to overview</Link>
      </div>
      <p className="text-gray-600 mb-6">
        Runtime validation benchmarks using real store schemas.
        {" "}{ITERATIONS.toLocaleString()} iterations per test.
      </p>

      {/* Research Data Charts */}
      <section className="mb-10 space-y-8">
        <h2 className="text-xl font-semibold">Research Data</h2>
        <p className="text-sm text-gray-500">
          Pre-computed benchmark results from CSV data. Click &quot;Run Benchmarks&quot; below to verify on your machine.
        </p>

        <ComparisonBarChart
          title="Validation Speed (ops/sec — higher is better)"
          items={validationSpeed.map((row) => ({
            label: row.test,
            leftValue: row.zodOps,
            rightValue: row.valibotOps,
            winner: row.winner === "Zod" ? "left" : "right",
            margin: row.margin,
          }))}
          leftLabel="Zod"
          rightLabel="Valibot"
          leftColor="#3b82f6"
          rightColor="#8b5cf6"
        />

        <ComparisonBarChart
          title="Schema Creation Speed (ops/sec — higher is better)"
          items={schemaCreationSpeed.map((row) => ({
            label: row.test,
            leftValue: row.zodOps,
            rightValue: row.valibotOps,
            winner: row.winner === "Zod" ? "left" : "right",
            margin: row.margin,
          }))}
          leftLabel="Zod"
          rightLabel="Valibot"
          leftColor="#3b82f6"
          rightColor="#8b5cf6"
        />

        <HorizontalBarChart
          title="Bundle Size (KB gzip — lower is better)"
          bars={[
            ...validationBundles.map((b) => ({
              label: b.library,
              value: b.fullKB,
              color: b.library.includes("Zod") || b.library.includes("zod") ? "#3b82f6" : "#8b5cf6",
              annotation: b.treeShakenKB !== b.fullKB ? `(${b.treeShakenKB} KB tree-shaken)` : undefined,
            })),
          ]}
          unit="KB"
        />

        <div className="bg-gray-50 border rounded p-4 text-sm space-y-2">
          <p><strong>Key insight:</strong> Zod wins on happy-path validation (1.5–1.75x faster), but Valibot dominates error-path (28x faster) and schema creation (14–19x faster).</p>
          <p><strong>Bundle:</strong> Valibot tree-shakes to 1.37 KB for a login form vs Zod&apos;s 17.7 KB (non-tree-shakeable). @zod/mini brings that to 3.9 KB.</p>
        </div>
      </section>

      <hr className="my-8" />

      {/* Live Benchmark Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Live Benchmark</h2>
        <button
          onClick={runBenchmarks}
          disabled={running}
          className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {running ? "Running benchmarks..." : "Run Benchmarks"}
        </button>

        {results.length > 0 && (
          <>
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Validation Speed (Reused Schemas)</h3>
              <p className="text-sm text-gray-500 mb-3">
                Pre-created schemas validating data — the common production pattern.
              </p>
              <ResultTable results={results} />
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Schema Creation Speed (One-Shot)</h3>
              <p className="text-sm text-gray-500 mb-3">
                Creating schemas in a loop — matters for React components that define schemas inline.
              </p>
              <ResultTable results={schemaCreationResults} />
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Error Message Comparison</h3>
              <p className="text-sm text-gray-500 mb-3">
                Invalid login input: email=&quot;not-an-email&quot;, password=&quot;short&quot;
              </p>
              {errorComparison && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-blue-700">Zod Errors</h4>
                    <pre className="bg-gray-50 border rounded p-3 text-xs overflow-auto max-h-64">
                      {errorComparison.zodErrors}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-purple-700">Valibot Errors</h4>
                    <pre className="bg-gray-50 border rounded p-3 text-xs overflow-auto max-h-64">
                      {errorComparison.valibotErrors}
                    </pre>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function ResultTable({ results }: { results: BenchmarkResult[] }) {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-50">
          <th className="border p-2 text-left">Test</th>
          <th className="border p-2 text-right">Zod (ms)</th>
          <th className="border p-2 text-right">Valibot (ms)</th>
          <th className="border p-2 text-right">Ratio</th>
          <th className="border p-2 text-center">Winner</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => (
          <tr key={r.name}>
            <td className="border p-2">{r.name}</td>
            <td className={`border p-2 text-right ${r.winner === "zod" ? "font-bold text-blue-700" : ""}`}>
              {r.zodMs.toFixed(1)}
            </td>
            <td className={`border p-2 text-right ${r.winner === "valibot" ? "font-bold text-purple-700" : ""}`}>
              {r.valibotMs.toFixed(1)}
            </td>
            <td className="border p-2 text-right font-mono text-sm">{r.ratio}</td>
            <td className="border p-2 text-center">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                r.winner === "zod" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
              }`}>
                {r.winner}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
