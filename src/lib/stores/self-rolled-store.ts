import { createStore } from "@/lib/self-rolled/store";

interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  checkoutStep: "cart" | "details" | "payment" | "confirmation";
}

export const uiStore = createStore<UIState>({
  isCartOpen: false,
  isMobileMenuOpen: false,
  checkoutStep: "cart",
});
