"use client";

import React, { useEffect } from "react";
import { X, Sparkles, AlertTriangle, ShieldCheck, Sun, Wind, Box } from "lucide-react";

interface CarePreservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CarePreservationModal: React.FC<CarePreservationModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const careRules = [
    {
      icon: <Wind className="w-5 h-5 text-accent-zari" />,
      title: "Muslin & Mulmul Enclosure",
      rule: "Never Store in Synthetic Plastic",
      desc: "Pure protein silk needs to breathe. Plastic traps microscopic moisture, causing mildew and tarnishing real silver zari threads. Always store your saree in the complimentary unbleached pure cotton mulmul bag supplied in your cedar chest.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-accent-zari" />,
      title: "Quarterly Refolding Ritual",
      rule: "Rotate Folds Every 90–120 Days",
      desc: "Heavy Kanchipuram and Banarasi zari will crease or weaken silk fibers if left on the same fold for years. Air the saree in a shaded, ventilated room for 30 minutes twice a year and refold along fresh crease lines.",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-accent-zari" />,
      title: "Perfume & Moisture Caution",
      rule: "No Direct Attar or Water Spray",
      desc: "Perfumes containing alcohol or aerosol propel liquids that permanently stain silk and cause electroplated silver zari to oxidize into black tarnish. Apply fragrance to your body first, and allow it to dry completely before draping.",
    },
    {
      icon: <Box className="w-5 h-5 text-accent-zari" />,
      title: "Botanical Protection",
      rule: "Cloves & Neem Instead of Camphor",
      desc: "Camphor and chemical mothballs release sulfurous fumes that discolor zari alloys. Instead, place dried whole cloves or dried neem leaves enclosed in small muslin sachets in the corners of your storage trunk.",
    },
    {
      icon: <Sun className="w-5 h-5 text-accent-zari" />,
      title: "Professional Cleansing",
      rule: "Dry Clean Only via Hydrocarbon",
      desc: "Never hand-wash or machine-wash handloom heirlooms. Entrust exclusively to certified heirloom dry cleaners who utilize gentle hydrocarbon solvent cycles without harsh bleach or alkaline detergents.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-accent-zari" />,
      title: "Low-Heat Pressing",
      rule: "Reverse Ironing with Barrier Cloth",
      desc: "Never place a hot iron directly onto gold or silver zari embroidery. Always iron on the reverse face with a clean white cotton cloth between the iron and the fabric, strictly on the lowest silk setting without steam.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-3xl bg-canvas-base border border-surface-border rounded-xs shadow-2xl p-6 sm:p-8 z-10 space-y-6 my-auto max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="care-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block">
              Curator’s Preservation Protocol
            </span>
            <h3 id="care-modal-title" className="font-serif text-2xl text-text-primary mt-1">
              Preserving Heirlooms for Generations
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary transition-colors border border-surface-border rounded-xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Introduction */}
        <div className="p-4 bg-canvas-elevated border border-surface-border text-xs text-text-secondary leading-relaxed font-light">
          A genuine handloom saree woven with pure mulberry silk and electroplated real silver zari is not merely an outfit—it is an appreciating family asset designed to last over 100 years when preserved with reverence.
        </div>

        {/* 6-Pillar Care Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careRules.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-canvas-base border border-surface-border/80 rounded-xs space-y-2 hover:border-surface-border transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-canvas-elevated border border-surface-border rounded-xs">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-serif text-sm text-text-primary font-medium">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono tracking-wider text-accent-zari-hover uppercase">
                    {item.rule}
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed pt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Complimentary Archival Packaging Assurance */}
        <div className="p-4 bg-canvas-elevated/80 border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
              Standard With Every Order
            </span>
            <p className="text-xs text-text-primary font-medium">
              Every Rami Studio heirloom ships enclosed in an unbleached mulmul cloth wrapper inside a signature cedarwood archival box.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors shrink-0"
          >
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};
