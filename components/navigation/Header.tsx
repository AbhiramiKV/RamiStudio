"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cartStore";
import { LogoWordmark } from "@/components/branding/LogoWordmark";
import { LogoMonogram } from "@/components/branding/LogoMonogram";
import { CURRENCY_RATES } from "@/lib/catalogData";
import { CurrencyCode } from "@/lib/types";
import { ShoppingBag, ChevronDown, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, openCart, currency, setCurrency } = useCartStore();

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-canvas-base/85 backdrop-blur-md border-b border-surface-border py-3 shadow-xs"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Edition Info & Navigation */}
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            data-cursor="HOME"
          >
            <LogoMonogram
              size={32}
              className="text-text-primary transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden xl:inline text-[10px] font-mono tracking-[0.2em] text-text-secondary uppercase">
              Drop 01
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-[11px] font-mono tracking-[0.14em] uppercase text-text-secondary">
            <Link
              href="/#curated-drop"
              className="hover:text-text-primary transition-colors"
            >
              Collection
            </Link>
            <Link
              href="/#fabric-lab"
              className="hover:text-text-primary transition-colors"
            >
              Fabric Lab
            </Link>
            <Link
              href="/#journal"
              className="hover:text-text-primary transition-colors"
            >
              Editorial
            </Link>
          </nav>
        </div>

        {/* Center: Brand Wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" data-cursor="RAMI">
            <LogoWordmark size={scrolled ? "sm" : "md"} withDescriptor={!scrolled} />
          </Link>
        </div>

        {/* Right: Film Replay, Currency Switcher & Bag Drawer Trigger */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* Cinématique Film Replay */}
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("replay-saree-film"))
            }
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-text-secondary hover:text-accent-zari-hover transition-colors px-2.5 py-1 rounded-sm border border-surface-border/70 hover:border-surface-border bg-canvas-base/50 cursor-pointer"
            data-cursor="PLAY FILM"
            title="Replay 1.8s Saree Entrance Film"
          >
            <Sparkles className="w-3 h-3 text-accent-zari" />
            <span className="text-[10px]">FILM</span>
          </button>
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-text-secondary hover:text-text-primary transition-colors px-2 py-1 rounded-sm border border-surface-border/70 hover:border-surface-border bg-canvas-base/50"
              aria-label="Select Currency"
            >
              <span suppressHydrationWarning>{mounted ? currency : "USD"}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {currencyOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-canvas-base border border-surface-border rounded-sm shadow-xl p-1 z-50 animate-fadeIn">
                {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setCurrency(code);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[11px] font-mono tracking-wider flex items-center justify-between rounded-xs transition-colors ${
                      currency === code
                        ? "bg-canvas-elevated text-text-primary font-medium"
                        : "text-text-secondary hover:bg-canvas-muted/50 hover:text-text-primary"
                    }`}
                  >
                    <span>{code}</span>
                    <span className="text-text-tertiary">
                      {CURRENCY_RATES[code].symbol}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bag Trigger Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 text-text-primary hover:text-accent-zari-hover transition-colors p-1.5 group"
            aria-label="Open Shopping Bag"
            data-cursor="OPEN BAG"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            <span
              suppressHydrationWarning
              className="text-[11px] font-mono tracking-wider"
            >
              BAG ({mounted ? totalItemCount : 0})
            </span>
            {mounted && totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-zari animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
