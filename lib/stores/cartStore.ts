import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SareeProduct, Colorway, CartItem, CurrencyCode, SareeCustomizations } from "../types";
import { CURRENCY_RATES } from "../catalogData";

interface CartState {
  isOpen: boolean;
  isCheckoutOpen: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  appliedPromoCode: string | null;
  promoDiscountUSD: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setCurrency: (code: CurrencyCode) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  addItem: (
    product: SareeProduct,
    selectedColorway: Colorway,
    withBlouse?: boolean,
    customizations?: SareeCustomizations
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemUnitPrice: (item: CartItem) => number;
  getSubtotalUSD: () => number;
  getTotalUSD: () => number;
  formatPrice: (amountUSD: number) => string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isCheckoutOpen: false,
      items: [],
      currency: "USD",
      appliedPromoCode: null,
      promoDiscountUSD: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      openCheckout: () => set({ isOpen: false, isCheckoutOpen: true }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      setCurrency: (code: CurrencyCode) => set({ currency: code }),

      applyPromoCode: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === "SWATCH25" || clean === "SWATCH-25" || clean === "ARCHIVE25") {
          set({ appliedPromoCode: clean, promoDiscountUSD: 25 });
          return { success: true, message: "$25 Swatch Archive credit applied!" };
        } else if (clean === "RAMI10" || clean === "HERITAGE10") {
          const discount = Math.round(get().getSubtotalUSD() * 0.1);
          set({ appliedPromoCode: clean, promoDiscountUSD: discount });
          return { success: true, message: "10% Connoisseur invitation credit applied!" };
        }
        return { success: false, message: "Invalid voucher code. Please check and retry." };
      },

      removePromoCode: () => set({ appliedPromoCode: null, promoDiscountUSD: 0 }),

      getItemUnitPrice: (item: CartItem) => {
        let price = item.product.priceUSD;
        if (item.customizations) {
          if (item.customizations.fallPico === "silk-rolled") {
            price += 15;
          }
          if (item.customizations.blouse.enabled) {
            price += item.customizations.blouse.priceUSD;
          }
          if (item.customizations.petticoat?.enabled) {
            price += item.customizations.petticoat.priceUSD;
          }
          if (item.customizations.tassels?.enabled) {
            price += item.customizations.tassels.priceUSD;
          }
          if (item.customizations.prePleated?.enabled) {
            price += item.customizations.prePleated.priceUSD;
          }
        } else if (item.withBlouse && item.product.blouseOption) {
          price += item.product.blouseOption.priceUSD;
        }
        return price;
      },

      addItem: (product, selectedColorway, withBlouse = false, customizations) => {
        set((state) => {
          const customKey = customizations
            ? `${customizations.fallPico}-${customizations.blouse.enabled ? `blouse-${customizations.blouse.styleOption}-${customizations.blouse.neckline || ""}-${customizations.blouse.sleeve || ""}-${customizations.blouse.measurements?.standardSize || "custom"}` : "nobig"}-${customizations.petticoat?.enabled ? `pet-${customizations.petticoat.waistSize}` : "nopet"}-${customizations.prePleated?.enabled ? `pleat-${customizations.prePleated.waistInches}` : "nopleat"}`
            : withBlouse ? "blouse-unstitched" : "base";

          const itemId = `${product.id}-${selectedColorway.id}-${customKey}`;
          const existingIndex = state.items.findIndex((i) => i.id === itemId);

          if (existingIndex > -1) {
            const updated = [...state.items];
            const maxPieces = product.totalPieces || 99;
            updated[existingIndex].quantity = Math.min(
              maxPieces,
              updated[existingIndex].quantity + 1
            );
            return { items: updated, isOpen: true };
          }

          let unitPrice = product.priceUSD;
          if (customizations) {
            if (customizations.fallPico === "silk-rolled") unitPrice += 15;
            if (customizations.blouse.enabled) unitPrice += customizations.blouse.priceUSD;
            if (customizations.petticoat?.enabled) unitPrice += customizations.petticoat.priceUSD;
            if (customizations.tassels?.enabled) unitPrice += customizations.tassels.priceUSD;
            if (customizations.prePleated?.enabled) unitPrice += customizations.prePleated.priceUSD;
          } else if (withBlouse && product.blouseOption) {
            unitPrice += product.blouseOption.priceUSD;
          }

          const newItem: CartItem = {
            id: itemId,
            product,
            selectedColorway,
            withBlouse: customizations ? customizations.blouse.enabled : withBlouse,
            customizations: customizations || {
              fallPico: "hand-stitched-free",
              blouse: {
                enabled: withBlouse,
                styleOption: "unstitched",
                priceUSD: withBlouse ? product.blouseOption.priceUSD : 0,
              },
            },
            quantity: 1,
            unitPriceUSD: unitPrice,
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
          items: state.items.map((i) => {
            if (i.id !== itemId) return i;
            const capped = Math.min(i.product.totalPieces || 99, quantity);
            return { ...i, quantity: capped };
          }),
        }));
      },

      clearCart: () => set({ items: [], appliedPromoCode: null, promoDiscountUSD: 0 }),

      getSubtotalUSD: () => {
        const { items, getItemUnitPrice } = get();
        return items.reduce((total, item) => {
          return total + getItemUnitPrice(item) * item.quantity;
        }, 0);
      },

      getTotalUSD: () => {
        const subtotal = get().getSubtotalUSD();
        const discount = get().promoDiscountUSD;
        return Math.max(0, subtotal - discount);
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
      partialize: (state) => ({
        items: state.items,
        currency: state.currency,
        appliedPromoCode: state.appliedPromoCode,
        promoDiscountUSD: state.promoDiscountUSD,
      }),
    }
  )
);

