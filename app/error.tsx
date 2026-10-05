"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { RefreshCw, ArrowRight } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error caught by error boundary:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex-1 min-h-[70vh] flex items-center justify-center px-6 py-24 bg-canvas-base border-b border-surface-border">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-accent-zari-hover block">
              Atelier Notification · Render Interruption
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-text-primary">
              Tension on the Loom
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light max-w-md mx-auto">
              A temporary interruption occurred while loading this chapter. Our digital atelier can reset the canvas for you.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => reset()}
              className="bg-text-primary text-canvas-base px-8 py-3.5 text-xs font-mono tracking-[0.2em] uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RE-ATTEMPT DRAPE</span>
            </button>
            <Link
              href="/"
              className="px-6 py-3.5 text-xs font-mono tracking-[0.2em] uppercase border border-surface-border hover:border-text-primary transition-colors text-text-primary flex items-center gap-2"
            >
              <span>RETURN TO ATELIER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
