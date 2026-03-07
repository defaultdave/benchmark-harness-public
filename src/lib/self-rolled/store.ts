"use client";

/**
 * Self-rolled state store (~50 lines)
 * Replaces: Zustand
 * Covers: global state with selective re-rendering via useSyncExternalStore
 */

import { useSyncExternalStore, useCallback, useRef } from "react";

type Listener = () => void;
type SetState<T> = (partial: Partial<T> | ((prev: T) => Partial<T>)) => void;

interface Store<T> {
  getState: () => T;
  setState: SetState<T>;
  subscribe: (listener: Listener) => () => void;
  useStore: {
    (): T;
    <S>(selector: (state: T) => S): S;
  };
}

export function createStore<T extends object>(
  initialState: T
): Store<T> {
  let state = initialState;
  const listeners = new Set<Listener>();

  function getState(): T {
    return state;
  }

  function setState(partial: Partial<T> | ((prev: T) => Partial<T>)) {
    const nextPartial =
      typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...nextPartial };
    listeners.forEach((l) => l());
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function useStore(): T;
  function useStore<S>(selector: (state: T) => S): S;
  function useStore<S>(selector?: (state: T) => S) {
    const selectorRef = useRef(selector);
    selectorRef.current = selector;

    const getSnapshot = useCallback(() => {
      const s = getState();
      return selectorRef.current ? selectorRef.current(s) : s;
    }, []);

    const getServerSnapshot = useCallback(() => {
      return selectorRef.current ? selectorRef.current(initialState) : initialState;
    }, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }

  return { getState, setState, subscribe, useStore };
}
