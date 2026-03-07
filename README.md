# Dependency Benchmark Harness

Side-by-side comparison of frontend dependencies vs. alternatives and self-rolled implementations. Built with Next.js 16 + React 19 + Vitest 4.0.

## Quick Start

```bash
npm install
npm run dev          # Start dev server at localhost:3000
```

Visit `http://localhost:3000` to see all test routes.

## Tests

| Route | What It Tests | Type |
|-------|--------------|------|
| `/i18n-test/next-intl` | next-intl i18n (7 locales, ICU plurals, RTL) | Library |
| `/i18n-test/react-i18next` | react-i18next i18n (same content, same locales) | Library |
| `/validation` | Zod vs Valibot (click "Run Benchmarks" for live results) | Benchmark |
| `/url-state/nuqs` | nuqs URL state management | Library |
| `/url-state/self-rolled` | Self-rolled URL state (~180 lines) | Self-Rolled |
| `/server-actions/safe-action` | next-safe-action wrapper | Library |
| `/server-actions/self-rolled` | Self-rolled action wrapper (~100 lines) | Self-Rolled |
| `/ui-state/zustand` | Zustand store | Library |
| `/ui-state/context` | React Context (baseline) | Native |
| `/ui-state/self-rolled` | Self-rolled store (~55 lines) | Self-Rolled |

## Running Benchmarks

### Validation (Zod vs Valibot) -- Vitest Bench

```bash
npx vitest bench
```

Runs 7 benchmark suites comparing Zod and Valibot on identical schemas.

### Validation (Browser) -- Interactive

Visit `/validation` and click "Run Benchmarks". Runs 10,000 iterations per test in the browser.

### Bundle Analysis

```bash
ANALYZE=true npm run build
```

Opens the bundle analyzer showing per-route sizes.

### UI State Re-render Test

Visit each UI state route and click "Toggle Cart". Watch render counts:
- **Zustand**: Only CartStatus re-renders (selector isolation)
- **Context**: ALL state panels re-render (full subtree)
- **Self-Rolled**: Only CartStatus re-renders (same as Zustand)

### i18n Comparison

Switch between the two i18n routes. Both show identical content in 7 locales. Compare setup complexity, plural handling, and RTL rendering.

## Self-Rolled Implementations

| File | Lines | Replaces |
|------|-------|----------|
| `src/lib/self-rolled/url-state.ts` | ~180 | nuqs |
| `src/lib/self-rolled/safe-action.ts` | ~100 | next-safe-action |
| `src/lib/self-rolled/store.ts` | ~55 | Zustand |
