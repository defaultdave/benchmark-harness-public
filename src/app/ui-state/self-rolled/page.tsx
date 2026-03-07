"use client";

import { uiStore } from "@/lib/stores/self-rolled-store";
import { useRef } from "react";
import Link from "next/link";

function CartStatus() {
  const renderCount = useRef(0);
  renderCount.current++;
  const isCartOpen = uiStore.useStore((s) => s.isCartOpen);
  return (
    <div className={`border rounded p-4 ${isCartOpen ? "bg-green-50 border-green-300" : "bg-gray-50"}`}>
      <h3 className="font-medium">Cart Panel</h3>
      <p>Status: {isCartOpen ? "OPEN" : "CLOSED"}</p>
      <p className="text-xs text-gray-500">Renders: {renderCount.current}</p>
    </div>
  );
}

function MenuStatus() {
  const renderCount = useRef(0);
  renderCount.current++;
  const isMobileMenuOpen = uiStore.useStore((s) => s.isMobileMenuOpen);
  return (
    <div className={`border rounded p-4 ${isMobileMenuOpen ? "bg-blue-50 border-blue-300" : "bg-gray-50"}`}>
      <h3 className="font-medium">Menu Panel</h3>
      <p>Status: {isMobileMenuOpen ? "OPEN" : "CLOSED"}</p>
      <p className="text-xs text-gray-500">Renders: {renderCount.current}</p>
    </div>
  );
}

function CheckoutStatus() {
  const renderCount = useRef(0);
  renderCount.current++;
  const checkoutStep = uiStore.useStore((s) => s.checkoutStep);
  return (
    <div className="border rounded p-4 bg-gray-50">
      <h3 className="font-medium">Checkout Panel</h3>
      <p>Step: {checkoutStep}</p>
      <p className="text-xs text-gray-500">Renders: {renderCount.current}</p>
    </div>
  );
}

function UnrelatedComponent() {
  const renderCount = useRef(0);
  renderCount.current++;
  return (
    <div className="border rounded p-4 bg-yellow-50 border-yellow-200">
      <h3 className="font-medium">Unrelated Component</h3>
      <p className="text-sm">Does NOT subscribe to store</p>
      <p className="text-xs text-gray-500">Renders: {renderCount.current}</p>
      <p className="text-xs text-red-500 mt-1">
        Should NOT re-render. Self-rolled store uses selectors like Zustand.
      </p>
    </div>
  );
}

function Controls() {
  const isCartOpen = uiStore.useStore((s) => s.isCartOpen);
  const steps: Array<"cart" | "details" | "payment" | "confirmation"> = ["cart", "details", "payment", "confirmation"];

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => uiStore.setState({ isCartOpen: !isCartOpen })}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Toggle Cart
      </button>
      <button
        onClick={() => uiStore.setState((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen }))}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Toggle Menu
      </button>
      {steps.map((step) => (
        <button
          key={step}
          onClick={() => uiStore.setState({ checkoutStep: step })}
          className="px-3 py-2 border rounded hover:bg-gray-50 text-sm"
        >
          Step: {step}
        </button>
      ))}
    </div>
  );
}

export default function SelfRolledStorePage() {
  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test 5c: Self-Rolled Store</h1>
        <div className="flex gap-3 text-sm">
          <Link href="/ui-state/zustand" className="text-blue-600 hover:underline">← Zustand</Link>
          <Link href="/ui-state/context" className="text-blue-600 hover:underline">← Context</Link>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
        <strong>Implementation:</strong> Self-rolled (~50 lines, useSyncExternalStore)
        <br />
        <strong>Key feature:</strong> Selector-based subscriptions — same isolation as Zustand, zero dependencies
      </div>

      <Controls />

      <div className="grid grid-cols-2 gap-4">
        <CartStatus />
        <MenuStatus />
        <CheckoutStatus />
        <UnrelatedComponent />
      </div>

      <div className="bg-gray-50 rounded p-3 text-sm">
        <strong>What to check:</strong> Same selective re-rendering as Zustand. Click &quot;Toggle Cart&quot; — only CartStatus re-renders. This proves the self-rolled store is functionally equivalent to Zustand for this use case.
      </div>
    </main>
  );
}
