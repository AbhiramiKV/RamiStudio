"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cartStore";
import { X, Minus, Plus, Trash2, ShieldCheck, ArrowRight } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    getSubtotalUSD,
    formatPrice,
  } = useCartStore();

  const subtotalUSD = getSubtotalUSD();
  const freeShippingThreshold = 1000;
  const progressPercent = Math.min(
    100,
    (subtotalUSD / freeShippingThreshold) * 100
  );
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotalUSD
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/40 backdrop-blur-xs transition-opacity duration-500 animate-fadeIn"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <aside
        className="relative w-full max-w-md bg-canvas-base h-full shadow-2xl z-10 flex flex-col justify-between border-l border-surface-border animate-slideLeft"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl tracking-wide uppercase">
              Shopping Bag
            </h2>
            <span className="text-[11px] font-mono text-text-secondary">
              ({items.reduce((s, i) => s + i.quantity, 0)} PIECES)
            </span>
          </div>

          <button
            onClick={closeCart}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-canvas-elevated px-6 py-3 border-b border-surface-border">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <span className="text-text-secondary">
              {remainingForFreeShipping === 0
                ? "COMPLIMENTARY DHL EXPRESS UNLOCKED"
                : `ADD ${formatPrice(remainingForFreeShipping)} FOR COMPLIMENTARY DHL`}
            </span>
            <span className="text-text-tertiary">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-1 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-zari transition-all duration-500 ease-silk-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-12 h-12 rounded-full border border-surface-border flex items-center justify-center text-text-tertiary">
                <span className="font-serif text-xl italic">R</span>
              </div>
              <p className="font-serif text-lg text-text-secondary">
                Your bag is currently empty.
              </p>
              <p className="text-xs text-text-tertiary max-w-xs leading-relaxed">
                Explore the curated drop to inspect our featherweight silks and
                antique zari weaves.
              </p>
              <button
                onClick={closeCart}
                className="mt-4 px-6 py-2.5 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors"
              >
                DISCOVER THE DROP
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-6 border-b border-surface-border/70 last:border-0"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-28 bg-canvas-elevated flex-shrink-0 overflow-hidden border border-surface-border">
                  <Image
                    src={item.product.images.hero}
                    alt={item.product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/sarees/${item.product.slug}`}
                        onClick={closeCart}
                        className="font-serif text-base text-text-primary hover:underline leading-snug"
                      >
                        {item.product.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-tertiary hover:text-text-primary transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-surface-border"
                        style={{ backgroundColor: item.selectedColorway.hex }}
                      />
                      <span className="text-[11px] font-mono text-text-secondary">
                        {item.selectedColorway.name}
                      </span>
                    </div>

                    {item.withBlouse && item.product.blouseOption && (
                      <div className="text-[10px] font-mono text-accent-zari-hover mt-1">
                        + With Unstitched Blouse Piece (
                        {formatPrice(item.product.blouseOption.priceUSD)})
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector with Accessible Touch Targets */}
                    <div className="flex items-center border border-surface-border bg-canvas-elevated">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center hover:bg-canvas-base transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5 text-text-secondary" />
                      </button>
                      <span className="px-3 text-xs font-mono select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center hover:bg-canvas-base transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5 text-text-secondary" />
                      </button>
                    </div>

                    <div className="text-sm font-mono text-text-primary">
                      {formatPrice(
                        (item.product.priceUSD +
                          (item.withBlouse && item.product.blouseOption
                            ? item.product.blouseOption.priceUSD
                            : 0)) *
                          item.quantity
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Tier with Safe-Area bottom inset */}
        {items.length > 0 && (
          <div
            className="p-6 border-t border-surface-border bg-canvas-elevated space-y-4"
            style={{
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
            }}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-text-secondary font-mono">
                <span>SUBTOTAL</span>
                <span>{formatPrice(subtotalUSD)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary font-mono">
                <span>ESTIMATED TAX & DUTIES</span>
                <span className="text-[10px] text-text-tertiary">
                  INCLUDED AT CHECKOUT
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-serif pt-2 border-t border-surface-border/50 text-text-primary">
                <span>TOTAL ESTIMATE</span>
                <span className="font-mono text-sm font-medium">
                  {formatPrice(subtotalUSD)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(
                  "Redirecting to Medusa / Stripe Express Secure Settlement Gateway..."
                );
              }}
              className="w-full bg-text-primary text-canvas-base py-3.5 px-4 text-xs font-mono tracking-[0.2em] uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center justify-center gap-2 group shadow-sm min-h-[48px]"
              data-cursor="EXPRESS CHECKOUT"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-text-tertiary">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-zari" />
              <span>AUTHENTICITY GUARANTEE · INSURED GLOBAL TRANSIT</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
