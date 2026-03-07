"use client";

/**
 * Self-rolled URL state management (~200 lines)
 * Replaces: nuqs
 * Covers: type-safe URL parsers, shallow routing, useState-like API
 */

import {
  useCallback,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

// --- Parsers ---

export interface Parser<T> {
  parse: (value: string | null) => T | null;
  serialize: (value: T) => string;
}

export const parseAsString: Parser<string> = {
  parse: (v) => v,
  serialize: (v) => v,
};

export const parseAsInteger: Parser<number> = {
  parse: (v) => {
    if (v === null) return null;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
  },
  serialize: (v) => String(v),
};

export const parseAsFloat: Parser<number> = {
  parse: (v) => {
    if (v === null) return null;
    const n = parseFloat(v);
    return Number.isNaN(n) ? null : n;
  },
  serialize: (v) => String(v),
};

export const parseAsBoolean: Parser<boolean> = {
  parse: (v) => {
    if (v === null) return null;
    return v === "true";
  },
  serialize: (v) => String(v),
};

export function parseAsArrayOf<T>(itemParser: Parser<T>): Parser<T[]> {
  return {
    parse: (v) => {
      if (v === null) return null;
      return v
        .split(",")
        .map((item) => itemParser.parse(item))
        .filter((item): item is T => item !== null);
    },
    serialize: (v) => v.map((item) => itemParser.serialize(item)).join(","),
  };
}

// --- URL subscription (shared singleton) ---

type Listener = () => void;
const listeners = new Set<Listener>();

function getSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

let currentSearch = typeof window !== "undefined" ? window.location.search : "";

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

function getServerSnapshot(): string {
  return "";
}

function notifyListeners() {
  const newSearch = window.location.search;
  if (newSearch !== currentSearch) {
    currentSearch = newSearch;
    listeners.forEach((l) => l());
  }
}

// Listen for popstate (back/forward navigation)
if (typeof window !== "undefined") {
  window.addEventListener("popstate", notifyListeners);
}

function updateUrl(
  params: URLSearchParams,
  mode: "push" | "replace" = "replace"
) {
  const newSearch = params.toString();
  const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;

  if (mode === "push") {
    window.history.pushState(null, "", newUrl);
  } else {
    window.history.replaceState(null, "", newUrl);
  }
  notifyListeners();
}

// --- Hooks ---

interface UseQueryStateOptions {
  defaultValue?: unknown;
  mode?: "push" | "replace";
}

export function useQueryState<T>(
  key: string,
  parser: Parser<T>,
  options: UseQueryStateOptions = {}
): [T | null, (value: T | null) => void] {
  const { defaultValue = null, mode = "replace" } = options;

  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo(() => {
    const params = new URLSearchParams(search);
    const raw = params.get(key);
    const parsed = parser.parse(raw);
    return parsed ?? (defaultValue as T | null);
  }, [search, key, parser, defaultValue]);

  const setValue = useCallback(
    (newValue: T | null) => {
      const params = getSearchParams();
      if (newValue === null || newValue === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, parser.serialize(newValue));
      }
      updateUrl(params, mode);
    },
    [key, parser, mode, defaultValue]
  );

  return [value, setValue];
}

type ParserMap = Record<string, Parser<unknown>>;
type StateFromParsers<T extends ParserMap> = {
  [K in keyof T]: T[K] extends Parser<infer V> ? V | null : never;
};

export function useQueryStates<T extends ParserMap>(
  parsers: T,
  options: UseQueryStateOptions = {}
): [StateFromParsers<T>, (updates: Partial<StateFromParsers<T>>) => void] {
  const { mode = "replace" } = options;
  const parsersRef = useRef(parsers);

  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const values = useMemo(() => {
    const params = new URLSearchParams(search);
    const result: Record<string, unknown> = {};
    for (const [key, parser] of Object.entries(parsersRef.current)) {
      result[key] = parser.parse(params.get(key));
    }
    return result as StateFromParsers<T>;
  }, [search]);

  const setValues = useCallback(
    (updates: Partial<StateFromParsers<T>>) => {
      const params = getSearchParams();
      for (const [key, value] of Object.entries(updates)) {
        const parser = parsersRef.current[key];
        if (!parser) continue;
        if (value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, parser.serialize(value as never));
        }
      }
      updateUrl(params, mode);
    },
    [mode]
  );

  return [values, setValues];
}
