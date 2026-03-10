// Benchmark data — typed constants derived from CSV files in /benchmark-data/*.csv
// The CSV files are the canonical source; this module mirrors them for use in React components.

export interface ValidationSpeed {
  test: string;
  zodOps: number;
  valibotOps: number;
  winner: "Zod" | "Valibot";
  margin: string;
}

export const validationSpeed: ValidationSpeed[] = [
  { test: "Login (valid)", zodOps: 6368803, valibotOps: 4205756, winner: "Zod", margin: "1.51x" },
  { test: "Login (invalid)", zodOps: 108023, valibotOps: 3029926, winner: "Valibot", margin: "28.05x" },
  { test: "Search params (9 fields)", zodOps: 1810641, valibotOps: 1034242, winner: "Zod", margin: "1.75x" },
  { test: "Cart mutation (4 fields)", zodOps: 3418912, valibotOps: 2271206, winner: "Zod", margin: "1.51x" },
  { test: "Nested form (10+ fields)", zodOps: 1788936, valibotOps: 1086867, winner: "Zod", margin: "1.65x" },
];

export interface SchemaCreationSpeed {
  test: string;
  zodOps: number;
  valibotOps: number;
  winner: "Zod" | "Valibot";
  margin: string;
}

export const schemaCreationSpeed: SchemaCreationSpeed[] = [
  { test: "Simple schema", zodOps: 23104, valibotOps: 319943, winner: "Valibot", margin: "13.85x" },
  { test: "Complex schema (nested + arrays)", zodOps: 6446, valibotOps: 121127, winner: "Valibot", margin: "18.79x" },
];

export interface BundleSize {
  library: string;
  fullKB: number;
  treeShakenKB: number;
}

export const bundleSizes: BundleSize[] = [
  { library: "Zod (full)", fullKB: 17.7, treeShakenKB: 17.7 },
  { library: "@zod/mini", fullKB: 3.9, treeShakenKB: 3.9 },
  { library: "Valibot", fullKB: 6.0, treeShakenKB: 1.37 },
  { library: "next-intl (precompile)", fullKB: 4.0, treeShakenKB: 4.0 },
  { library: "next-intl (no precompile)", fullKB: 13.0, treeShakenKB: 13.0 },
  { library: "react-i18next", fullKB: 22.0, treeShakenKB: 22.0 },
  { library: "Zustand", fullKB: 1.0, treeShakenKB: 1.0 },
  { library: "nuqs", fullKB: 2.0, treeShakenKB: 2.0 },
  { library: "Self-rolled URL state", fullKB: 0, treeShakenKB: 0 },
  { library: "Self-rolled server actions", fullKB: 0, treeShakenKB: 0 },
  { library: "Self-rolled store", fullKB: 0, treeShakenKB: 0 },
];

export type RiskLevel = "Very Low" | "Low" | "Moderate" | "High" | "Highest";
export type Verdict = "KEEP" | "INVESTIGATE" | "KEEP with risk plan" | "REPLACE";
export type Grade = "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D";

export interface DependencyScore {
  dependency: string;
  role: string;
  systemReliability: Grade;
  ownerReliability: Grade;
  communityConfidence: Grade;
  swappable: "Low" | "Medium" | "High";
  riskLevel: RiskLevel;
  verdict: Verdict;
}

export const dependencyScorecard: DependencyScore[] = [
  { dependency: "TanStack Query", role: "Client data", systemReliability: "A", ownerReliability: "B+", communityConfidence: "A", swappable: "Low", riskLevel: "Low", verdict: "KEEP" },
  { dependency: "Zustand", role: "UI state", systemReliability: "A", ownerReliability: "B", communityConfidence: "A", swappable: "High", riskLevel: "Very Low", verdict: "KEEP" },
  { dependency: "shadcn/ui", role: "Components", systemReliability: "A", ownerReliability: "B+", communityConfidence: "A", swappable: "High", riskLevel: "Very Low", verdict: "KEEP" },
  { dependency: "nuqs", role: "URL state", systemReliability: "A", ownerReliability: "C+", communityConfidence: "B+", swappable: "Medium", riskLevel: "Low", verdict: "KEEP" },
  { dependency: "next-safe-action", role: "Server actions", systemReliability: "B+", ownerReliability: "C", communityConfidence: "C+", swappable: "High", riskLevel: "Low", verdict: "KEEP" },
  { dependency: "Zod", role: "Validation", systemReliability: "B", ownerReliability: "C+", communityConfidence: "A-", swappable: "Medium", riskLevel: "Moderate", verdict: "INVESTIGATE" },
  { dependency: "next-intl", role: "i18n", systemReliability: "A-", ownerReliability: "C", communityConfidence: "B+", swappable: "Low", riskLevel: "Highest", verdict: "KEEP with risk plan" },
  { dependency: "Radix", role: "UI primitives", systemReliability: "C+", ownerReliability: "D+", communityConfidence: "B-", swappable: "Medium", riskLevel: "High", verdict: "REPLACE" },
];

export interface RerenderResult {
  implementation: string;
  cartStatus: boolean;
  menuStatus: boolean;
  checkoutStatus: boolean;
  unrelated: boolean;
}

export const rerenderIsolation: RerenderResult[] = [
  { implementation: "Zustand", cartStatus: true, menuStatus: false, checkoutStatus: false, unrelated: false },
  { implementation: "React Context", cartStatus: true, menuStatus: true, checkoutStatus: true, unrelated: false },
  { implementation: "Self-Rolled", cartStatus: true, menuStatus: false, checkoutStatus: false, unrelated: false },
];

export interface SelfRollComparison {
  dependency: string;
  libraryBundleKB: number | null;
  selfRolledLines: number;
  featuresLost: string;
  functionalParity: boolean;
}

export const selfRollComparisons: SelfRollComparison[] = [
  { dependency: "nuqs (URL state)", libraryBundleKB: 2.0, selfRolledLines: 201, featuresLost: "Testing adapter; framework portability", functionalParity: true },
  { dependency: "next-safe-action", libraryBundleKB: null, selfRolledLines: 83, featuresLost: "useAction hook; bind args; useOptimisticAction", functionalParity: true },
  { dependency: "Zustand (UI state)", libraryBundleKB: 1.0, selfRolledLines: 65, featuresLost: "DevTools; persist/immer middleware", functionalParity: true },
];

export interface I18nComparison {
  dimension: string;
  nextIntl: string;
  reactI18next: string;
}

export const i18nComparisons: I18nComparison[] = [
  { dimension: "Bundle size (KB)", nextIntl: "4", reactI18next: "22" },
  { dimension: "RSC integration", nextIntl: "Native", reactI18next: "Bolted on" },
  { dimension: "ICU plural support", nextIntl: "Native", reactI18next: "Plugin required" },
  { dimension: "Type safety", nextIntl: "Built-in", reactI18next: "Extra setup required" },
  { dimension: "Bus factor", nextIntl: "1", reactI18next: "High (multi-maintainer)" },
  { dimension: "Framework portability", nextIntl: "Next.js only", reactI18next: "Any React framework" },
  { dimension: "Init complexity", nextIntl: "1 provider + messages prop", reactI18next: "init() + provider + resources + helper" },
  { dimension: "Arabic 6-form plurals", nextIntl: "Out of the box", reactI18next: "Requires configuration" },
];

// Category groupings for the dependency breakdown view
export type Category = "validation" | "i18n" | "state" | "url-state" | "server-actions" | "components";

export interface CategoryInfo {
  id: Category;
  label: string;
  dependencies: string[];
  testRoutes: { label: string; href: string }[];
}

export const categories: CategoryInfo[] = [
  {
    id: "validation",
    label: "Validation",
    dependencies: ["Zod", "@zod/mini", "Valibot"],
    testRoutes: [{ label: "Zod vs Valibot", href: "/validation" }],
  },
  {
    id: "i18n",
    label: "Internationalization",
    dependencies: ["next-intl", "react-i18next"],
    testRoutes: [
      { label: "next-intl", href: "/i18n-test/next-intl" },
      { label: "react-i18next", href: "/i18n-test/react-i18next" },
    ],
  },
  {
    id: "state",
    label: "UI State",
    dependencies: ["Zustand", "React Context", "Self-rolled store"],
    testRoutes: [
      { label: "Zustand", href: "/ui-state/zustand" },
      { label: "React Context", href: "/ui-state/context" },
      { label: "Self-rolled", href: "/ui-state/self-rolled" },
    ],
  },
  {
    id: "url-state",
    label: "URL State",
    dependencies: ["nuqs", "Self-rolled URL state"],
    testRoutes: [
      { label: "nuqs", href: "/url-state/nuqs" },
      { label: "Self-rolled", href: "/url-state/self-rolled" },
    ],
  },
  {
    id: "server-actions",
    label: "Server Actions",
    dependencies: ["next-safe-action", "Self-rolled actions"],
    testRoutes: [
      { label: "next-safe-action", href: "/server-actions/safe-action" },
      { label: "Self-rolled", href: "/server-actions/self-rolled" },
    ],
  },
  {
    id: "components",
    label: "UI Components",
    dependencies: ["shadcn/ui", "Radix", "TanStack Query"],
    testRoutes: [],
  },
];
