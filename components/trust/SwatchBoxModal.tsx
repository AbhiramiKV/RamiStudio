"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { SWATCH_BOX_OFFER } from "@/lib/catalogData";
import { useCartStore } from "@/lib/stores/cartStore";
import { X, Sparkles, Check, Package, ArrowRight } from "lucide-react";

interface SwatchBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwatchBoxModal: React.FC<SwatchBoxModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { formatPrice } = useCartStore();
  const [ordered, setOrdered] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-text-primary/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-xl bg-canvas-base border border-surface-border rounded-xs shadow-2xl p-6 sm:p-8 z-10 space-y-6 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="swatch-modal-title"
      >
        <div className="flex items-start justify-between border-b border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-zari/15 border border-accent-zari/40 flex items-center justify-center text-accent-zari-hover">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block">
                Tactile Inspection Service
              </span>
              <h3 id="swatch-modal-title" className="font-serif text-2xl text-text-primary">
                Order The Swatch Archive
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary transition-colors border border-surface-border rounded-xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-[16/9] w-full bg-canvas-elevated overflow-hidden border border-surface-border">
          <Image
            src={SWATCH_BOX_OFFER.image}
            alt="Tactile Swatch Box"
            fill
            sizes="600px"
            className="object-cover"
          />
          <div className="absolute top-3 left-3 bg-canvas-base/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono tracking-widest text-text-primary border border-surface-border uppercase">
            100% REIMBURSED ON PURCHASE
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h4 className="font-serif text-xl text-text-primary">
              {SWATCH_BOX_OFFER.title}
            </h4>
            <span className="font-mono text-lg font-medium text-text-primary">
              {formatPrice(SWATCH_BOX_OFFER.priceUSD)}
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed font-light">
            {SWATCH_BOX_OFFER.description}
          </p>

          <div className="p-4 bg-canvas-elevated border border-surface-border text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-text-primary">
              <Check className="w-3.5 h-3.5 text-accent-zari" />
              <span>4×4 in. Pure Mulberry Korvai Kanchipuram Swatch</span>
            </div>
            <div className="flex items-center gap-2 text-text-primary">
              <Check className="w-3.5 h-3.5 text-accent-zari" />
              <span>4×4 in. Featherweight Banarasi Katan Organza Swatch</span>
            </div>
            <div className="flex items-center gap-2 text-text-primary">
              <Check className="w-3.5 h-3.5 text-accent-zari" />
              <span>4×4 in. Raw Wild Tussar Slub Silk Swatch</span>
            </div>
            <div className="flex items-center gap-2 text-text-primary">
              <Check className="w-3.5 h-3.5 text-accent-zari" />
              <span>Antique Matte Silver Zari Skein sample with burn test yarn</span>
            </div>
          </div>
        </div>

        {ordered ? (
          <div className="p-4 bg-accent-zari/10 border border-accent-zari/40 text-xs font-mono text-text-primary flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-accent-zari flex-shrink-0" />
            <span>
              Your Tactile Swatch Kit request has been recorded. Our concierge will dispatch via DHL Express with your personal $25 store credit redemption code.
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] font-mono text-text-tertiary text-center sm:text-left">
              Complimentary Worldwide Express Courier
            </span>

            <button
              onClick={() => setOrdered(true)}
              className="w-full sm:w-auto px-8 py-3 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>REQUEST SWATCH ARCHIVE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
