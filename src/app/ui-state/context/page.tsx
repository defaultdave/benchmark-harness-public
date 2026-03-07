"use client";

import { createContext, useContext, useState, useRef, type ReactNode } from "react";
import Link from "next/link";

// --- Context-based UI state ---
interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  checkoutStep: "cart" | "details" | "payment" | "confirmation";
}

interface UIActions {
  openCart: () => void;
  closeCart: () => void;
  toggleMobileMenu: () => void;
  setCheckoutStep: (step: UIState["checkoutStep"]) => void;
}

const UIStateContext = createContext<UIState | null>(null);
const UIActionsContext = createContext<UIActions | null>(null);

function UIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>({
    isCartOpen: false,
    isMobileMenuOpen: false,
    checkoutStep: "cart",
  });

  const actions: UIActions = {
    openCart: () => setState((s) => ({ ...s, isCartOpen: true })),
    closeCart: () => setState((s) => ({ ...s, isCartOpen: false })),
    toggleMobileMenu: () => setState((s) => ({ ...s, isMobileMenuOpen: !s.isMobileMenuOpen })),
    setCheckoutStep: (step) => setState((s) => ({ ...s, checkoutStep: step })),
  };

  return (
    <UIStateContext.Provider value={state}>
      <UIActionsContext.Provider value={actions}>
        {children}
      </UIActionsContext.Provider>
    </UIStateContext.Provider>
  );
}

function useUIState() {
  const ctx = useContext(UIStateContext);
  if (!ctx) throw new Error("Missing UIProvider");
  return ctx;
}

function useUIActions() {
  const ctx = useContext(UIActionsContext);
  if (!ctx) throw new Error("Missing UIProvider");
  return ctx;
}

// --- Components ---

function CartStatus() {
  const renderCount = useRef(0);
  renderCount.current++;
  const { isCartOpen } = useUIState();
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
  const { isMobileMenuOpen } = useUIState();
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
  const { checkoutStep } = useUIState();
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
      <p className="text-sm">Does NOT read any context state</p>
      <p className="text-xs text-gray-500">Renders: {renderCount.current}</p>
      <p className="text-xs text-red-500 mt-1">
        Should NOT re-render (not a context consumer).
        But Cart/Menu/Checkout WILL all re-render on ANY state change.
      </p>
    </div>
  );
}

function Controls() {
  const { isCartOpen } = useUIState();
  const { openCart, closeCart, toggleMobileMenu, setCheckoutStep } = useUIActions();
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

export default function ContextPage() {
  return (
    <UIProvider>
      <main className="max-w-2xl mx-auto p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Test 5b: React Context</h1>
          <div className="flex gap-3 text-sm">
            <Link href="/ui-state/zustand" className="text-blue-600 hover:underline">← Zustand</Link>
            <Link href="/ui-state/self-rolled" className="text-blue-600 hover:underline">Self-Rolled →</Link>
          </div>
        </div>

        <div className="bg-gray-100 border rounded p-3 text-sm">
          <strong>Implementation:</strong> React Context (0KB — built-in)
          <br />
          <strong>Key limitation:</strong> ALL consumers re-render on ANY state change — no selective subscriptions
        </div>

        <Controls />

        <div className="grid grid-cols-2 gap-4">
          <CartStatus />
          <MenuStatus />
          <CheckoutStatus />
          <UnrelatedComponent />
        </div>

        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
          <strong>What to check:</strong> Click &quot;Toggle Cart&quot; — ALL three state panels (Cart, Menu, Checkout) will increment their render count, because they all consume the same context. The Unrelated component should NOT re-render. Compare this to Zustand where only CartStatus re-renders.
        </div>
      </main>
    </UIProvider>
  );
}
