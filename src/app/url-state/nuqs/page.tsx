"use client";

import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense, useRef } from "react";
import Link from "next/link";

function SearchFilters() {
  const [location, setLocation] = useQueryState("location", parseAsString);
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault("all"));
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger.withDefault(0));
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger.withDefault(1000));
  const [rating, setRating] = useQueryState("rating", parseAsInteger);
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("recommended"));

  const categories = ["all", "bits", "bobs", "doodads", "thingamajigs", "widgets"];
  const sortOptions = ["recommended", "price", "rating", "distance"];
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  const renderCount = renderCountRef.current;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test 3a: nuqs</h1>
        <Link href="/url-state/self-rolled" className="text-blue-600 hover:underline text-sm">
          Switch to Self-Rolled →
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
        <strong>Implementation:</strong> nuqs library (~2KB gzip)
        <br />
        <strong>Render count:</strong> {renderCount}
        <br />
        <strong>Current URL:</strong> <code className="text-xs">{typeof window !== "undefined" ? window.location.search : ""}</code>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={location ?? ""}
          onChange={(e) => setLocation(e.target.value || null)}
          placeholder="Where are you going?"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === "all" ? null : cat)}
              className={`px-3 py-1 rounded-full text-sm border ${
                category === cat ? "bg-blue-600 text-white border-blue-600" : "border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <div className="flex gap-2">
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setRating(rating === r ? null : r)}
              className={`px-3 py-1 rounded border ${
                rating === r ? "bg-yellow-500 text-white border-yellow-500" : "border-gray-300"
              }`}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium mb-1">Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {sortOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Current state display */}
      <div className="bg-gray-50 rounded p-3">
        <h3 className="font-medium text-sm mb-2">Current Filter State</h3>
        <pre className="text-xs">
          {JSON.stringify({ location, category, minPrice, maxPrice, rating, sort }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function NuqsPage() {
  return (
    <NuqsAdapter>
      <main className="max-w-2xl mx-auto p-8">
        <Suspense fallback={<div>Loading filters...</div>}>
          <SearchFilters />
        </Suspense>
      </main>
    </NuqsAdapter>
  );
}
