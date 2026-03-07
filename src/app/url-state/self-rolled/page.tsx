"use client";

import {
  useQueryState,
  parseAsString,
  parseAsInteger,
} from "@/lib/self-rolled/url-state";
import { useRef } from "react";
import Link from "next/link";

export default function SelfRolledUrlStatePage() {
  const [location, setLocation] = useQueryState("location", parseAsString);
  const [category, setCategory] = useQueryState("category", parseAsString, { defaultValue: "all" });
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger, { defaultValue: 0 });
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger, { defaultValue: 1000 });
  const [rating, setRating] = useQueryState("rating", parseAsInteger);
  const [sort, setSort] = useQueryState("sort", parseAsString, { defaultValue: "recommended" });

  const categories = ["all", "bits", "bobs", "doodads", "thingamajigs", "widgets"];
  const sortOptions = ["recommended", "price", "rating", "distance"];
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  const renderCount = renderCountRef.current;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Test 3b: Self-Rolled URL State</h1>
          <Link href="/url-state/nuqs" className="text-blue-600 hover:underline text-sm">
            ← Switch to nuqs
          </Link>
        </div>

        <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
          <strong>Implementation:</strong> Self-rolled (~200 lines, 0 dependencies)
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
              value={minPrice ?? 0}
              onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Price</label>
            <input
              type="number"
              value={maxPrice ?? 1000}
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
            value={sort ?? "recommended"}
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
    </main>
  );
}
