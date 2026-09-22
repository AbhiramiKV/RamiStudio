"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cartStore";
import { LogoWordmark } from "@/components/branding/LogoWordmark";
import { LogoMonogram } from "@/components/branding/LogoMonogram";
import { CURRENCY_RATES } from "@/lib/catalogData";
import { CurrencyCode } from "@/lib/types";
import { ShoppingBag, ChevronDown, Sparkles, Menu } from "lucide-react";
import { MobileNavDrawer } from "./MobileNavDrawer";

const emptySubscribe = () => () => {};

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { items, openCart, currency, setCurrency } = useCartStore();

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Heritage Trust Banner */}
      <div className="bg-canvas-elevated border-b border-surface-border py-1.5 px-4 text-center text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-text-secondary uppercase">
        <span className="hidden md:inline">Complimentary Hand-Stitched Fall & Pico · Silk Mark Certified Heirlooms · Worldwide DHL Express DDP · 7-Day In-Home Inspection</span>
        <span className="md:hidden">Silk Mark Certified · Free Fall & Pico · DHL Express</span>
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-canvas-base/90 backdrop-blur-md border-b border-surface-border py-2 sm:py-2.5 shadow-xs"
            : "bg-transparent py-3 sm:py-5"
        }`}
        style={{
          paddingTop: scrolled
            ? "max(0.5rem, env(safe-area-inset-top, 0px))"
            : "max(0.75rem, env(safe-area-inset-top, 0px))",
        }}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Left: Mobile Menu Trigger + Monogram + Desktop Nav */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-1 text-text-primary hover:text-accent-zari-hover transition-colors rounded-xs focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 group min-w-[36px]"
              data-cursor="HOME"
            >
              <LogoMonogram
                size={28}
                className="text-text-primary transition-transform duration-300 group-hover:scale-105 sm:w-[32px] sm:h-[32px]"
              />
              <span className="hidden xl:inline text-[10px] font-mono tracking-[0.2em] text-accent-zari-hover uppercase">
                Heirloom Edition
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-[11px] font-mono tracking-[0.14em] uppercase text-text-secondary">
              <Link
                href="/#curated-drop"
                className="hover:text-text-primary transition-colors"
              >
                Heirlooms
              </Link>
              <Link
                href="/#fabric-lab"
                className="hover:text-text-primary transition-colors"
              >
                Weave Guide
              </Link>
              <Link
                href="/#journal"
                className="hover:text-text-primary transition-colors"
              >
                Artisan Monograph
              </Link>
            </nav>
          </div>

          {/* Center: Brand Wordmark */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
            <Link href="/" data-cursor="RAMI">
              <div className="hidden sm:block">
                <LogoWordmark size={scrolled ? "sm" : "md"} withDescriptor={!scrolled} />
              </div>
              <div className="sm:hidden">
                <LogoWordmark size="sm" withDescriptor={false} />
              </div>
            </Link>
          </div>

          {/* Right: Film Replay, Currency Switcher & Bag Drawer Trigger */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
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

            {/* Currency Switcher (Desktop / Tablet) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-text-secondary hover:text-text-primary transition-colors px-2 py-1 rounded-sm border border-surface-border/70 hover:border-surface-border bg-canvas-base/50 min-h-[36px]"
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

            {/* Bag Trigger Button with 44px min tap area */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 sm:gap-2 text-text-primary hover:text-accent-zari-hover transition-colors p-2 min-h-[44px] min-w-[44px] justify-center group"
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
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-zari animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-In Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
};
