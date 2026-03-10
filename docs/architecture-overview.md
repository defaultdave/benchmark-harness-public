# Next.js E-Commerce Site — Architecture Overview

**Date:** 2026-02-25
**Phase:** Architecture Design
**Status:** Draft

---

## Executive Summary

This document defines the frontend architecture for a Next.js e-commerce site. The site includes **search results**, **product detail/booking**, and **cart/checkout** pages using Next.js App Router.

The architecture follows a **server-first, client-island** model. React Server Components handle data fetching and static content. Client Components handle interactivity (filters, cart, checkout). Streaming via Suspense provides progressive page rendering so users see content before all data has loaded.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rendering model | RSC-first with client islands | Minimize client JS, maximize server caching |
| URL state | nuqs | Type-safe, SSR-compatible, shareable/bookmarkable |
| Server data mutations | Server Actions (next-safe-action + Zod) | Collocated with UI, type-safe, progressive enhancement |
| Client data | TanStack Query (hydrated from RSC) | Cache, refetch, optimistic updates for dynamic data |
| UI state | Zustand | Minimal, SSR-safe, outside React tree |
| Component library | shadcn/ui + Base UI (extend existing UI kit) | Base UI built by original Radix team; Radix deprioritized; shadcn/ui supports both |
| i18n | next-intl v4 + `[locale]` path prefix | RSC-native, type-safe, SSR-compatible, 30+ country support |
| Multi-currency | Cookie-based, server-side conversion | No URL bloat, server-authoritative pricing, no CLS |
| Validation | Zod (server) + Valibot (client) | Zod for ecosystem compat; Valibot 3-13x smaller bundle for client-side |
| Caching | Tagged ISR + on-demand revalidation | Fine-grained: static shell cached, pricing/availability dynamic |
| Testing | Vitest (unit/integration) + Playwright (E2E) | Industry standard |
| Observability | Datadog RUM + APM | Industry standard |

---

## Design Principles

These principles guide every architectural decision. When in doubt, default to these:

1. **Server by default, client by exception.** Every component starts as a Server Component. Add `'use client'` only when it needs `useState`, `useEffect`, event handlers, or browser APIs.

2. **URL is the source of truth for discoverable state.** Filters, sort order, date selection, pagination — anything a user would want to share or bookmark lives in the URL, not in React state.

3. **Progressive rendering over blocking.** Use Suspense boundaries so the page shell appears instantly. Expensive data (pricing, availability, reviews) streams in as it resolves. Never block the full page on the slowest query.

4. **Server-authoritative for money.** All pricing, discounts, and totals are calculated server-side. The client displays server-provided values. Never trust client-side price calculations.

5. **Accessibility is structural, not cosmetic.** Built on Radix primitives with a11y baked in. WCAG 2.1 AA compliance is a launch gate, not a follow-up task.

6. **Experimentation from day zero.** Feature flags are a first-class architectural concern, not retrofitted. Every surface is experiment-aware by default.

7. **Performance budgets are product requirements.** Core Web Vitals targets are defined upfront and enforced in CI. Performance regression blocks merge.

8. **Composable over monolithic.** Components are small, typed, and composable.

---

## App Router Route Structure

### File System Layout

All user-facing routes live under `app/[locale]/` for internationalization. API routes and webhooks remain outside the locale segment.

```
app/
├── [locale]/                           # All localized routes under locale prefix
│   ├── layout.tsx                      # Root locale layout (providers, fonts, dir, lang)
│   │
│   ├── (marketing)/                    # Marketing route group
│   │   ├── page.tsx                    # Homepage
│   │   ├── about/page.tsx
│   │   └── blog/[slug]/page.tsx
│   │
│   ├── s/                              # Search routes
│   │   ├── layout.tsx                  # Search layout (persistent filters sidebar)
│   │   ├── [country]/
│   │   │   └── [state]/
│   │   │       └── [city]/
│   │   │           ├── page.tsx        # City search results
│   │   │           ├── loading.tsx     # Search skeleton
│   │   │           └── error.tsx       # Search error boundary
│   │   └── page.tsx                    # Global search (no location)
│   │
│   ├── products/                       # Product detail routes
│   │   └── [slug]/
│   │       ├── page.tsx                # Product detail page (SSR shell + streaming)
│   │       ├── loading.tsx             # Product detail skeleton
│   │       ├── error.tsx               # Product error boundary
│   │       └── @cart/                  # Parallel route: cart sidebar
│   │           └── default.tsx
│   │
│   ├── gift-cards/
│   │   └── buy/page.tsx                # Gift card purchase flow
│   │
│   ├── (account)/                      # Authenticated route group
│   │   ├── layout.tsx                  # Account layout (auth guard)
│   │   ├── orders/page.tsx
│   │   ├── favorites/page.tsx
│   │   └── settings/page.tsx
│   │
│   └── not-found.tsx                   # Locale-aware 404
│
├── api/                                # Route handlers (NOT localized)
│   ├── revalidate/route.ts            # Webhook for on-demand cache invalidation
│   ├── webhooks/
│   │   ├── stripe/route.ts            # Payment webhooks
│   │   └── inventory/route.ts         # Inventory update webhooks
│   └── og/route.tsx                    # Dynamic OG image generation
│
├── i18n/                               # i18n configuration (not a route)
│   ├── routing.ts                     # Locale list, pathnames, prefix config
│   ├── request.ts                     # Server-side locale resolution
│   └── navigation.ts                  # Locale-aware Link, redirect, usePathname
│
├── messages/                           # Translation files
│   ├── en.json
│   ├── fr.json
│   ├── es.json
│   ├── de.json
│   ├── ja.json
│   ├── pt-BR.json
│   └── ar.json
│
└── middleware.ts                        # Locale detection, redirect, A/B, geo
```

**URL examples across locales:**
```
example.com/en/products/thingamabob
example.com/fr/products/thingamabob
example.com/es/productos/thingamabob              ← localized path segment
example.com/ar/products/thingamabob                ← RTL layout
example.com/en/s/us/fl/miami?date=03-15-2026&category=pool
```

### Key Routing Decisions

**Why `app/[locale]/` as the root segment:**
- Next.js App Router removed built-in i18n — the `[locale]` dynamic segment is the official pattern
- next-intl v4 provides middleware that handles detection, redirect, and cookie persistence
- `generateStaticParams` at the layout level pre-builds all locale variants
- API routes (`app/api/`) stay outside `[locale]` — webhooks and external consumers don't need localization

**Why `/[locale]/s/[country]/[state]/[city]` for search:**
- Matches existing URL pattern with locale prefix added
- SEO-friendly (locale + location in URL, crawlable per language)
- `generateStaticParams` can pre-build popular destinations × locales
- Dynamic segments allow organic discovery of new locations

**Why parallel route `@cart` for cart sidebar:**
- Cart renders independently from product content
- Can have its own loading/error states
- Doesn't block product detail page rendering
- Layout-level composition keeps the component tree clean

**Why route groups `(marketing)` and `(account)`:**
- Different layouts for marketing pages vs. authenticated pages
- Auth guard lives in the `(account)` layout, not scattered across pages
- Marketing pages can use a simpler layout without auth providers

### Layout Composition

Three key layouts, each with distinct responsibilities:

**Root Locale Layout** (`app/[locale]/layout.tsx`):
- Validates locale against supported list (404 for unknown locales)
- Calls `setRequestLocale()` for static rendering support
- Loads translations via `getMessages()`, wraps tree in `NextIntlClientProvider`
- Sets `<html lang={locale} dir={dir}>` (RTL detection via locale set)
- Wraps children in `Providers` (feature flags, cookies, user settings)
- Renders `Header`, `Footer`, deferred `Analytics`

**Search Layout** (`app/[locale]/s/layout.tsx`):
- Two-column flex layout: persistent `SearchFilters` sidebar (client component) + `main` content area
- Filters sidebar stays mounted across search navigation (no re-render on page change)

**Product Detail Layout** (`app/[locale]/products/[slug]/layout.tsx`):
- Responsive grid: main content + sticky cart sidebar (380px, hidden on mobile)
- Cart sidebar uses the `@cart` parallel route — renders independently from page content
- On mobile, cart becomes a bottom sheet (client component)

---

## Server vs. Client Component Boundaries

### The Boundary Map

| Component | Type | Reason |
|-----------|------|--------|
| **Page shells** (layout, header, footer) | Server | No interactivity, static HTML |
| **Product info** (name, description, amenities, policies) | Server | Pure display, fetched at request time |
| **SEO metadata** (`generateMetadata`) | Server | Must be in initial HTML |
| **Image gallery** (static display) | Server | `next/image`, no state |
| **Reviews list** | Server (streamed) | Async fetch, no client interaction needed |
| **Search results grid** | Server (streamed) | Async fetch, no client interaction in cards |
| **Search filters panel** | **Client** | `useState`, URL manipulation via nuqs |
| **Date picker** | **Client** | Interactive input, calendar UI |
| **Product selector** (quantity, time slots) | **Client** | Form state, user interaction |
| **Cart sidebar** | **Client** | Real-time state, add/remove items |
| **Checkout form** | **Client** | Form state, Stripe Elements, payment |
| **Image carousel/lightbox** | **Client** | Swipe gestures, zoom, modal |
| **Map** | **Client** | Browser API (Google Maps/Mapbox) |
| **Favorite button** | **Client** | Click handler, optimistic update |
| **Sort dropdown** | **Client** | Interactive select, URL update |
| **Infinite scroll trigger** | **Client** | Intersection Observer |
| **Mobile cart sheet** | **Client** | Drawer/sheet UI, gestures |

### The Composition Pattern

Server Components fetch data and pass it to Client Components as props. This keeps data fetching on the server while isolating interactivity.

**Pattern:** Server page → fetches data → renders Server child components for static content → passes data as props to Client child components for interactive content. Suspense boundaries wrap async Server Components so the page shell appears before slow data resolves.

**Example flow:**
```
ProductPage (Server) → fetches product data
  ├── ProductHero (Server) ← receives product as prop, renders static HTML
  └── Suspense → VariantsLoader (Server) → fetches variants
                   └── ProductSelector (Client) ← receives products as props
```

### Rules for the Team

1. **Never add `'use client'` to a file that doesn't need it.** If a component only renders JSX from props, it stays Server.
2. **Lift client boundaries as high as possible.** One `'use client'` at the feature boundary (e.g., `ProductSelector`), not on every sub-component.
3. **Pass Server Component children into Client Component wrappers.** A Client wrapper (e.g., `CartDrawer`) that manages open/close state can accept Server Component children via the `children` prop — the children stay on the server.

---

## Appendix: Technology Decisions Summary

| Category | Decision | Alternatives Considered | Why This Choice |
|----------|----------|------------------------|-----------------|
| Framework | Next.js 16 App Router | Remix, Astro, SvelteKit | RSC-first architecture, strong ecosystem, Vercel deployment |
| UI | shadcn/ui + **Base UI** | Radix, Ark UI, React Aria, Headless UI | Base UI built by original Radix creators; Radix deprioritized by WorkOS (co-creator called it a "liability"); shadcn/ui supports Base UI as drop-in alternative |
| Styling | Tailwind CSS | CSS Modules, Styled Components | Great DX with shadcn/ui, utility-first |
| URL State | nuqs | useSearchParams, self-rolled (~200 lines) | Type-safe, SSR-compatible, used by Vercel/Sentry/Supabase; self-rolled is viable fallback |
| Server Data | TanStack Query | SWR, RSC-only | 749K dependents, TkDodo (Sentry) as co-maintainer, RSC is complementary not competing |
| Client State | Zustand | Redux, Jotai, React Context, self-rolled (~55 lines) | 1KB, selector isolation, self-rolled fallback trivial |
| Forms | useActionState + next-safe-action | React Hook Form, self-rolled (~100 lines) | Thin wrapper, self-rolled fallback viable; zsa competitor conceded |
| i18n | next-intl v4 | react-i18next, Paraglide, Lingui | RSC-native, type-safe, ~4KB with precompile, ICU plurals; **RISK: solo maintainer** — react-i18next is documented fallback |
| Testing | Vitest + Playwright | Jest + Cypress | Vitest faster than Jest; Playwright more reliable |
| Validation | Zod (server) + Valibot (client) | Zod-only, ArkType | Zod 1.5x faster valid-path; Valibot 28x faster error-path, 14x faster schema creation, 3-13x smaller bundle; both support Standard Schema |
| Observability | Datadog RUM + APM | Sentry, New Relic | Industry standard |
| Images | Cloudflare CDN + custom loader | Vercel Image Optimization, Cloudinary | CDN flexibility, cost control |

---

## Appendix: Dependency Health Scorecard

Competitive analysis conducted 2026-03-06.

| Dependency | System | Owner | Community | Swappable? | Risk Level |
|------------|--------|-------|-----------|------------|------------|
| nuqs | A | C+ (solo maintainer) | B+ (Vercel uses it) | Medium | Low |
| TanStack Query | A | B+ (TkDodo co-maintains) | A (749K dependents) | Low | Low |
| Zustand | A | B (Poimandres collective) | A (57K stars) | High | Very Low |
| Zod | B (v3/v4 messy) | C+ (solo, governance concern) | A- (ecosystem lock-in) | Medium | Moderate |
| Valibot | A- | B (growing team) | B (4.7M/wk, Rolldown adopted) | Medium | Low |
| next-intl | A- | C (solo maintainer) | B+ (Node.js website uses it) | Low | **Highest** |
| next-safe-action | B+ | C (solo, but very active) | C+ (40K/wk) | High | Low |
| shadcn/ui | A | B+ (Vercel-backed) | A (105K stars) | High (copy-paste) | Very Low |
| Base UI | A | A (MUI + ex-Radix team) | B+ (growing) | Medium | Low |

### Risk Mitigations

**next-intl (highest risk — solo maintainer on critical i18n path):**
1. Wrap `useTranslations` in a project-level `useT()` hook to isolate the API surface
2. Keep translation files in standard ICU JSON format (no next-intl-specific patterns)
3. Monitor repo health quarterly (release frequency, issue response time)
4. Document react-i18next as fallback with migration runbook

**Zod (governance concern — messy v3/v4 transition):**
1. Use Valibot for client-side validation (smaller bundle, faster error path)
2. Use Zod for server-side (ecosystem integration with next-safe-action, tRPC)
3. Both support Standard Schema spec — swappable at the action layer

**Radix (declining — replaced by Base UI):**
1. Initialize shadcn/ui with Base UI primitives (not Radix)
2. Base UI v1.0 shipped Dec 2025, built by original Radix creators

### Vendored & Self-Rolled Code: Drift Tracking

Copied-in components (shadcn/ui) and self-rolled utilities (URL state, server actions, store) eliminate upgrade risk but introduce **drift risk** — upstream improvements and security patches don't arrive automatically.

**Mitigation: AI agent that monitors upstream sources, flags drift, and opens PRs.**

How it works:
1. A scheduled agent compares vendored code against its upstream source (shadcn/ui registry, library release notes, CVE databases)
2. For **security patches**: agent opens a PR with the fix applied, flagged as priority
3. For **feature improvements**: agent opens an issue describing the upstream change, with a diff showing what would change locally, for human review
4. For **self-rolled utilities** (349 lines total): agent checks whether the native platform APIs they wrap have changed (e.g. Next.js router behavior, React APIs) and flags if the self-rolled code needs updating

What gets tracked:

| Source                | Local Code                       | Monitor For                                            |
|-----------------------|----------------------------------|--------------------------------------------------------|
| shadcn/ui registry    | `components/ui/*`                | Component updates, a11y fixes, Base UI primitive changes |
| nuqs / self-rolled    | `lib/self-rolled/url-state.ts`   | Next.js router API changes, shallow routing behavior   |
| next-safe-action / self-rolled | `lib/self-rolled/safe-action.ts` | Server action API changes, security advisories |
| Zustand / self-rolled | `lib/self-rolled/store.ts`       | React `useSyncExternalStore` API changes               |
| Valibot / Zod         | validation schemas               | Security advisories, Standard Schema spec updates      |

This turns "we own the code" from a liability into an advantage: no surprise breaking upgrades, but security and quality improvements still flow in — on your schedule, with review.
