import { create } from "zustand";

interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  checkoutStep: "cart" | "details" | "payment" | "confirmation";
  renderTracker: number;
  openCart: () => void;
  closeCart: () => void;
  toggleMobileMenu: () => void;
  setCheckoutStep: (step: UIState["checkoutStep"]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  checkoutStep: "cart",
  renderTracker: 0,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  setCheckoutStep: (step) => set({ checkoutStep: step }),
}));
