import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LogoMonogram } from "@/components/branding/LogoMonogram";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-[70vh] flex items-center justify-center px-6 py-24 bg-canvas-base border-b border-surface-border">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-surface-border mx-auto flex items-center justify-center text-accent-zari">
            <LogoMonogram size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block">
              Folio Reference 404 · Uncharted Loom
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-text-primary">
              This Piece Rests in the Archive
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light max-w-md mx-auto">
              The weave or chapter you requested cannot be found. It may have been a limited single-batch drop or moved to our private vault.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="bg-text-primary text-canvas-base px-8 py-3.5 text-xs font-mono tracking-[0.2em] uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-2"
            >
              <span>RETURN TO MAISON</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/#curated-drop"
              className="px-6 py-3.5 text-xs font-mono tracking-[0.2em] uppercase border border-surface-border hover:border-text-primary transition-colors text-text-primary"
            >
              DISCOVER HEIRLOOMS
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
