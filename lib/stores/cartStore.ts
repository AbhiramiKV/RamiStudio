import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SareeProduct, Colorway, CartItem, CurrencyCode } from "../types";
import { CURRENCY_RATES } from "../catalogData";

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCurrency: (code: CurrencyCode) => void;
  addItem: (product: SareeProduct, selectedColorway: Colorway, withBlouse?: boolean) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotalUSD: () => number;
  formatPrice: (amountUSD: number) => string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      items: [],
      currency: "USD",

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCurrency: (code: CurrencyCode) => set({ currency: code }),

      addItem: (product, selectedColorway, withBlouse = false) => {
        set((state) => {
          const itemId = `${product.id}-${selectedColorway.id}-${withBlouse ? "blouse" : "base"}`;
          const existingIndex = state.items.findIndex((i) => i.id === itemId);

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated, isOpen: true };
          }

          const newItem: CartItem = {
            id: itemId,
            product,
            selectedColorway,
            withBlouse,
            quantity: 1,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotalUSD: () => {
        return get().items.reduce((total, item) => {
          let itemTotal = item.product.priceUSD;
          if (item.withBlouse && item.product.blouseOption) {
            itemTotal += item.product.blouseOption.priceUSD;
          }
          return total + itemTotal * item.quantity;
        }, 0);
      },

      formatPrice: (amountUSD: number) => {
        const { currency } = get();
        const rateObj = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
        const converted = amountUSD * rateObj.rate;

        if (currency === "INR") {
          return `${rateObj.symbol}${Math.round(converted).toLocaleString("en-IN")}`;
        }
        return `${rateObj.symbol}${Math.round(converted).toLocaleString("en-US")}`;
      },
    }),
    {
      name: "rami-cart-storage",
      partialize: (state) => ({ items: state.items, currency: state.currency }),
    }
  )
);
