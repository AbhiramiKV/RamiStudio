"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { LogoMonogram } from "@/components/branding/LogoMonogram";
import { LogoWordmark } from "@/components/branding/LogoWordmark";
import { CURRENCY_RATES } from "@/lib/catalogData";
import { CurrencyCode } from "@/lib/types";
import { useCartStore } from "@/lib/stores/cartStore";
import { X, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { currency, setCurrency } = useCartStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex">
      {/* Dimmed Blur Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className="relative w-[85vw] max-w-[340px] bg-canvas-base h-full shadow-2xl z-10 flex flex-col justify-between border-r border-surface-border animate-slideRight overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        style={{
          paddingTop: "max(1.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* Header Tier */}
        <div className="px-6 pb-6 border-b border-surface-border/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMonogram size={30} className="text-text-primary" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-text-secondary uppercase">
              Drop 01
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors border border-surface-border rounded-xs"
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation Links */}
        <div className="px-6 py-8 space-y-6 flex-1">
          <div className="text-[9px] font-mono tracking-[0.3em] uppercase text-text-tertiary">
            Digital Flagship
          </div>

          <nav className="space-y-4">
            {[
              { label: "Master Heirlooms", href: "/#curated-drop", note: "Single-Batch Pure Silk Drops" },
              { label: "The Weave Guide", href: "/#fabric-lab", note: "Tactile Metrology & Weights" },
              { label: "Artisan Monograph", href: "/#journal", note: "Weaver Guilds & Heritage Notes" },
            ].map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex flex-col py-2 border-b border-surface-border/40 hover:border-text-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-text-primary group-hover:translate-x-1 transition-transform">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono text-text-tertiary">
                    0{idx + 1}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-secondary tracking-wider mt-0.5">
                  {item.note}
                </span>
              </Link>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="pt-2 space-y-2.5">
            <a
              href="https://wa.me/919840123456?text=Hello%20Rami%20Studio%20Concierge,%20I%20would%20like%20to%20consult%20a%20handloom%20stylist."
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full flex items-center justify-between p-3 border border-accent-zari/40 bg-canvas-elevated hover:bg-canvas-base transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-zari" />
                <span className="text-[11px] font-mono tracking-wider uppercase text-text-primary">
                  1-on-1 WhatsApp Stylist
                </span>
              </div>
              <ArrowRight className="w-3 h-3 text-accent-zari" />
            </a>

            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("replay-saree-film"));
              }}
              className="w-full flex items-center justify-between p-3 border border-surface-border bg-canvas-elevated hover:bg-canvas-base transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent-zari" />
                <span className="text-[11px] font-mono tracking-widest uppercase text-text-primary">
                  Replay Saree Entrance Film
                </span>
              </div>
              <ArrowRight className="w-3 h-3 text-text-tertiary" />
            </button>
          </div>

          {/* Currency Switcher in Drawer */}
          <div className="pt-4">
            <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase block mb-2">
              Currency Settlement
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`py-2 px-2 text-center text-xs font-mono tracking-wider border rounded-xs transition-colors ${
                    currency === code
                      ? "bg-text-primary text-canvas-base border-text-primary font-medium"
                      : "bg-canvas-elevated text-text-secondary border-surface-border hover:border-text-secondary"
                  }`}
                >
                  <div>{code}</div>
                  <div className="text-[9px] opacity-70">
                    {CURRENCY_RATES[code].symbol}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Provenance Tier */}
        <div className="px-6 pt-6 border-t border-surface-border/70 space-y-3 bg-canvas-elevated/50">
          <LogoWordmark size="sm" withDescriptor={false} />
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-text-tertiary uppercase">
            <ShieldCheck className="w-3 h-3 text-accent-zari" />
            <span>Kanchipuram · Banarasi · Matte Zari</span>
          </div>
          <div className="text-[9px] font-mono text-text-tertiary">
            © 2026 RAMI STUDIO LLC
          </div>
        </div>
      </aside>
    </div>
  );
};
