import Link from "next/link";
import {
  dependencyScorecard,
  categories,
  bundleSizes,
  validationSpeed,
  schemaCreationSpeed,
  selfRollComparisons,
} from "@/lib/benchmark-data";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Dependency Benchmark Harness</h1>
      <p className="text-gray-600 mb-8">
        Side-by-side comparison of every named frontend dependency vs. alternatives and self-rolled implementations.
      </p>

      {/* Dependency Scorecard */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Dependency Scorecard</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Dependency</th>
                <th className="border px-3 py-2 text-left">Role</th>
                <th className="border px-3 py-2 text-center">System</th>
                <th className="border px-3 py-2 text-center">Owner</th>
                <th className="border px-3 py-2 text-center">Community</th>
                <th className="border px-3 py-2 text-center">Swappable</th>
                <th className="border px-3 py-2 text-center">Risk</th>
                <th className="border px-3 py-2 text-center">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {dependencyScorecard.map((dep) => (
                <tr key={dep.dependency} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-medium">{dep.dependency}</td>
                  <td className="border px-3 py-2 text-gray-600">{dep.role}</td>
                  <td className="border px-3 py-2 text-center">
                    <Grade value={dep.systemReliability} />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <Grade value={dep.ownerReliability} />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <Grade value={dep.communityConfidence} />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <SwappableBadge value={dep.swappable} />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <RiskBadge value={dep.riskLevel} />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <VerdictBadge value={dep.verdict} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Key Findings</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Self-Roll Savings"
            value="335 lines"
            detail="Replaces 3 libraries (nuqs, next-safe-action, Zustand)"
          />
          <StatCard
            label="Valibot Error Path"
            value="28x faster"
            detail="vs. Zod on invalid input validation"
          />
          <StatCard
            label="Bundle Reduction"
            value="Valibot 1.37 KB"
            detail="vs. Zod 17.7 KB (tree-shaken login form)"
          />
        </div>
      </section>

      {/* Category Breakdown */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">By Category</h2>
        <div className="space-y-6">
          {categories.map((cat) => (
            <CategorySection key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Priority View */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">By Priority</h2>
        <div className="space-y-8">
          <PriorityGroup
            label="Priority 1 — Highest Risk"
            color="text-red-700"
            cards={[
              { href: "/i18n-test/next-intl", title: "Test 1a: next-intl", description: "i18n via next-intl — RSC-native, type-safe, solo maintainer", badge: "LIBRARY" as const },
              { href: "/i18n-test/react-i18next", title: "Test 1b: react-i18next", description: "i18n via react-i18next — battle-tested, multi-maintainer", badge: "LIBRARY" as const },
            ]}
          />
          <PriorityGroup
            label="Priority 2 — Investigate"
            color="text-orange-700"
            cards={[
              { href: "/validation", title: "Test 2: Zod vs Valibot", description: "Bundle size, schema speed, type inference", badge: "BENCHMARK" as const },
            ]}
          />
          <PriorityGroup
            label="Priority 3 — Self-Roll Candidates"
            color="text-blue-700"
            cards={[
              { href: "/url-state/nuqs", title: "Test 3a: nuqs", description: "URL state via nuqs library", badge: "LIBRARY" as const },
              { href: "/url-state/self-rolled", title: "Test 3b: Self-Rolled URL State", description: "~180 lines, type-safe parsers + shallow routing", badge: "SELF-ROLLED" as const },
              { href: "/server-actions/safe-action", title: "Test 4a: next-safe-action", description: "Server action wrapper library", badge: "LIBRARY" as const },
              { href: "/server-actions/self-rolled", title: "Test 4b: Self-Rolled Actions", description: "~100 lines, auth middleware + validation", badge: "SELF-ROLLED" as const },
              { href: "/ui-state/zustand", title: "Test 5a: Zustand", description: "State via Zustand store", badge: "LIBRARY" as const },
              { href: "/ui-state/context", title: "Test 5b: React Context", description: "Native React Context (baseline)", badge: "NATIVE" as const },
              { href: "/ui-state/self-rolled", title: "Test 5c: Self-Rolled Store", description: "~55 lines, useSyncExternalStore", badge: "SELF-ROLLED" as const },
            ]}
          />
        </div>
      </section>

      {/* Bundle Size Overview */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Bundle Size Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Library</th>
                <th className="border px-3 py-2 text-right">Full Bundle (KB)</th>
                <th className="border px-3 py-2 text-right">Tree-Shaken (KB)</th>
                <th className="border px-3 py-2">Size</th>
              </tr>
            </thead>
            <tbody>
              {bundleSizes
                .filter((b) => b.fullKB > 0)
                .sort((a, b) => b.fullKB - a.fullKB)
                .map((b) => (
                  <tr key={b.library} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 font-medium">{b.library}</td>
                    <td className="border px-3 py-2 text-right">{b.fullKB}</td>
                    <td className="border px-3 py-2 text-right">{b.treeShakenKB}</td>
                    <td className="border px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 bg-blue-500 rounded"
                          style={{ width: `${(b.fullKB / 22) * 100}%`, minWidth: "4px" }}
                        />
                        {b.treeShakenKB !== b.fullKB && (
                          <div
                            className="h-4 bg-blue-200 rounded"
                            style={{ width: `${(b.treeShakenKB / 22) * 100}%`, minWidth: "4px" }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            Self-rolled implementations (URL state, server actions, store) add 0 KB — they&apos;re just application code.
          </p>
        </div>
      </section>

      {/* Validation Speed Preview */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Validation Speed — Zod vs Valibot
          <Link href="/validation" className="text-sm font-normal text-blue-600 hover:underline ml-3">
            Run live benchmarks →
          </Link>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Test</th>
                <th className="border px-3 py-2 text-right">Zod (ops/sec)</th>
                <th className="border px-3 py-2 text-right">Valibot (ops/sec)</th>
                <th className="border px-3 py-2 text-center">Winner</th>
                <th className="border px-3 py-2 text-center">Margin</th>
              </tr>
            </thead>
            <tbody>
              {validationSpeed.map((row) => (
                <tr key={row.test} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{row.test}</td>
                  <td className={`border px-3 py-2 text-right font-mono ${row.winner === "Zod" ? "font-bold text-purple-700" : ""}`}>
                    {row.zodOps.toLocaleString()}
                  </td>
                  <td className={`border px-3 py-2 text-right font-mono ${row.winner === "Valibot" ? "font-bold text-green-700" : ""}`}>
                    {row.valibotOps.toLocaleString()}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      row.winner === "Zod" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                    }`}>
                      {row.winner}
                    </span>
                  </td>
                  <td className="border px-3 py-2 text-center font-mono text-sm">{row.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h3 className="font-medium text-sm mb-2">Schema Creation Speed</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Test</th>
                <th className="border px-3 py-2 text-right">Zod (ops/sec)</th>
                <th className="border px-3 py-2 text-right">Valibot (ops/sec)</th>
                <th className="border px-3 py-2 text-center">Winner</th>
                <th className="border px-3 py-2 text-center">Margin</th>
              </tr>
            </thead>
            <tbody>
              {schemaCreationSpeed.map((row) => (
                <tr key={row.test} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{row.test}</td>
                  <td className={`border px-3 py-2 text-right font-mono ${row.winner === "Zod" ? "font-bold text-purple-700" : ""}`}>
                    {row.zodOps.toLocaleString()}
                  </td>
                  <td className={`border px-3 py-2 text-right font-mono ${row.winner === "Valibot" ? "font-bold text-green-700" : ""}`}>
                    {row.valibotOps.toLocaleString()}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      row.winner === "Zod" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                    }`}>
                      {row.winner}
                    </span>
                  </td>
                  <td className="border px-3 py-2 text-center font-mono text-sm">{row.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Self-Roll Summary */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Self-Roll Viability</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Dependency</th>
                <th className="border px-3 py-2 text-right">Library Size (KB)</th>
                <th className="border px-3 py-2 text-right">Self-Rolled Lines</th>
                <th className="border px-3 py-2 text-left">Features Lost</th>
                <th className="border px-3 py-2 text-center">Parity?</th>
              </tr>
            </thead>
            <tbody>
              {selfRollComparisons.map((row) => (
                <tr key={row.dependency} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-medium">{row.dependency}</td>
                  <td className="border px-3 py-2 text-right font-mono">
                    {row.libraryBundleKB !== null ? row.libraryBundleKB : "n/a"}
                  </td>
                  <td className="border px-3 py-2 text-right font-mono">{row.selfRolledLines}</td>
                  <td className="border px-3 py-2 text-gray-600 text-xs">{row.featuresLost}</td>
                  <td className="border px-3 py-2 text-center">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Yes
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

// --- Sub-components ---

function CategorySection({ category }: { category: typeof categories[number] }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{category.label}</h3>
        <div className="flex gap-1">
          {category.dependencies.map((dep) => (
            <span key={dep} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {dep}
            </span>
          ))}
        </div>
      </div>
      {category.testRoutes.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {category.testRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm px-3 py-1.5 border rounded hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              {route.label} →
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No interactive tests — evaluated via scorecard only.</p>
      )}
    </div>
  );
}

function PriorityGroup({
  label,
  color,
  cards,
}: {
  label: string;
  color: string;
  cards: { href: string; title: string; description: string; badge: "LIBRARY" | "SELF-ROLLED" | "NATIVE" | "BENCHMARK" }[];
}) {
  return (
    <div>
      <h3 className={`text-lg font-semibold mb-3 ${color}`}>{label}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <TestCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  );
}

function TestCard({
  href,
  title,
  description,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  badge: "LIBRARY" | "SELF-ROLLED" | "NATIVE" | "BENCHMARK";
}) {
  const badgeColors = {
    LIBRARY: "bg-purple-100 text-purple-800",
    "SELF-ROLLED": "bg-green-100 text-green-800",
    NATIVE: "bg-gray-100 text-gray-800",
    BENCHMARK: "bg-orange-100 text-orange-800",
  };

  return (
    <Link
      href={href}
      className="block border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${badgeColors[badge]}`}>
          {badge}
        </span>
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </Link>
  );
}

function Grade({ value }: { value: string }) {
  const color = value.startsWith("A")
    ? "bg-green-100 text-green-800"
    : value.startsWith("B")
    ? "bg-blue-100 text-blue-800"
    : value.startsWith("C")
    ? "bg-yellow-100 text-yellow-800"
    : "bg-red-100 text-red-800";

  return <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${color}`}>{value}</span>;
}

function RiskBadge({ value }: { value: string }) {
  const color =
    value === "Very Low"
      ? "bg-green-100 text-green-800"
      : value === "Low"
      ? "bg-blue-100 text-blue-800"
      : value === "Moderate"
      ? "bg-yellow-100 text-yellow-800"
      : value === "High"
      ? "bg-orange-100 text-orange-800"
      : "bg-red-100 text-red-800";

  return <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${color}`}>{value}</span>;
}

function VerdictBadge({ value }: { value: string }) {
  const color =
    value === "KEEP"
      ? "bg-green-100 text-green-800"
      : value === "INVESTIGATE"
      ? "bg-orange-100 text-orange-800"
      : value === "REPLACE"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";

  return <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${color}`}>{value}</span>;
}

function SwappableBadge({ value }: { value: string }) {
  const color =
    value === "High"
      ? "bg-green-100 text-green-800"
      : value === "Medium"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${color}`}>{value}</span>;
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{detail}</p>
    </div>
  );
}
