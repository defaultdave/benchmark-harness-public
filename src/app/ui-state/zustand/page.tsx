"use client";

import { useUIStore } from "@/lib/stores/zustand-store";
import { useRef } from "react";
import Link from "next/link";

function CartStatus() {
  const renderCount = useRef(0);
  renderCount.current++;
  const isCartOpen = useUIStore((s) => s.isCartOpen);
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
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
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
  const checkoutStep = useUIStore((s) => s.checkoutStep);
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
      <p className="text-sm">Does NOT subscribe to any store state</p>
      <p className="text-xs text-gray-500">Renders: {renderCount.current}</p>
      <p className="text-xs text-red-500 mt-1">
        If this re-renders when you click buttons, the store is leaking updates.
      </p>
    </div>
  );
}

function Controls() {
  const openCart = useUIStore((s) => s.openCart);
  const closeCart = useUIStore((s) => s.closeCart);
  const isCartOpen = useUIStore((s) => s.isCartOpen);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const setCheckoutStep = useUIStore((s) => s.setCheckoutStep);
  const steps: Array<"cart" | "details" | "payment" | "confirmation"> = ["cart", "details", "payment", "confirmation"];

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={() => isCartOpen ? closeCart() : openCart()} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Toggle Cart
      </button>
      <button onClick={toggleMobileMenu} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Toggle Menu
      </button>
      {steps.map((step) => (
        <button key={step} onClick={() => setCheckoutStep(step)} className="px-3 py-2 border rounded hover:bg-gray-50 text-sm">
          Step: {step}
        </button>
      ))}
    </div>
  );
}

export default function ZustandPage() {
  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test 5a: Zustand</h1>
        <div className="flex gap-3 text-sm">
          <Link href="/ui-state/context" className="text-blue-600 hover:underline">Context →</Link>
          <Link href="/ui-state/self-rolled" className="text-blue-600 hover:underline">Self-Rolled →</Link>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded p-3 text-sm">
        <strong>Implementation:</strong> Zustand (~1KB gzip)
        <br />
        <strong>Key feature:</strong> Selector-based subscriptions — only re-renders components that read changed state
      </div>

      <Controls />

      <div className="grid grid-cols-2 gap-4">
        <CartStatus />
        <MenuStatus />
        <CheckoutStatus />
        <UnrelatedComponent />
      </div>

      <div className="bg-gray-50 rounded p-3 text-sm">
        <strong>What to check:</strong> Click &quot;Toggle Cart&quot; — only CartStatus should increment its render count. Menu, Checkout, and Unrelated should stay at their current count. This proves selector-based isolation.
      </div>
    </main>
  );
}
