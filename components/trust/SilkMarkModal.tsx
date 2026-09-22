"use client";

import React, { useEffect } from "react";
import { SareeProduct } from "@/lib/types";
import { X, ShieldCheck, CheckCircle2, Award, FileText } from "lucide-react";

interface SilkMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  saree: SareeProduct;
}

export const SilkMarkModal: React.FC<SilkMarkModalProps> = ({
  isOpen,
  onClose,
  saree,
}) => {
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-canvas-base border border-surface-border rounded-xs shadow-2xl p-6 sm:p-8 z-10 space-y-6 my-auto max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="silkmark-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-zari/15 border border-accent-zari/40 flex items-center justify-center text-accent-zari-hover">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block">
                Official Certification & Purity Audit
              </span>
              <h3 id="silkmark-modal-title" className="font-serif text-2xl text-text-primary">
                Silk Mark & Zari Integrity Guarantee
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

        {/* Certificate Card */}
        <div className="p-5 bg-canvas-elevated border border-surface-border space-y-4 rounded-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-text-primary text-canvas-base uppercase tracking-widest text-[10px]">
                GOVERNMENT REGISTRATION
              </span>
              <span className="text-text-primary font-medium">
                {saree.certification.silkMarkLicenseNo}
              </span>
            </div>
            <span className="text-accent-zari-hover font-semibold">
              GI TAG: {saree.certification.craftClusterRegNo}
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed font-light">
            Every piece in the Rami Studio archive is independently tested and authenticated under the auspices of the <strong>Silk Mark Organization of India (SMOI)</strong>, sponsored by the Central Silk Board, Ministry of Textiles, Government of India.
          </p>

          {/* Audit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 bg-canvas-base border border-surface-border space-y-1">
              <div className="flex items-center gap-1.5 text-text-primary font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-zari" />
                <span>100% Natural Protein Silk</span>
              </div>
              <p className="text-[11px] text-text-tertiary">
                Zero polyester, nylon, or viscose blending. Pure sericin-rich mulberry/tussar yarn.
              </p>
            </div>

            <div className="p-3 bg-canvas-base border border-surface-border space-y-1">
              <div className="flex items-center gap-1.5 text-text-primary font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-zari" />
                <span>Certified Zari Metallurgy</span>
              </div>
              <p className="text-[11px] text-text-tertiary">
                {saree.certification.zariSilverPercentage > 0
                  ? `${saree.certification.zariSilverPercentage}% Pure Silver Electroplated over silk core with antique matte lacquer.`
                  : "Certified 100% pure silk cord selvedge (Zero synthetic metallic foil)."}
              </p>
            </div>
          </div>
        </div>

        {/* Master Artisan Provenance */}
        <div className="border border-surface-border p-5 space-y-3 bg-canvas-base">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-tertiary uppercase tracking-widest">
              Loom Provenance & Weaver Guild
            </span>
            <span className="text-text-primary font-medium">
              {saree.provenance.villageCluster}
            </span>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-serif text-lg text-text-primary">
              Handcrafted by {saree.provenance.masterArtisan}
            </h4>
            <p className="text-xs text-text-secondary">
              {saree.provenance.lineage} · {saree.provenance.loomHeritage}
            </p>
          </div>

          {saree.provenance.quote && (
            <blockquote className="border-l-2 border-accent-zari pl-3 italic text-xs text-text-secondary font-serif">
              &ldquo;{saree.provenance.quote}&rdquo;
            </blockquote>
          )}
        </div>

        {/* The Silk Burn Test Explainer */}
        <div className="p-4 bg-canvas-elevated/70 border border-surface-border text-xs text-text-secondary space-y-2">
          <div className="flex items-center gap-2 font-mono text-[11px] text-text-primary uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-accent-zari" />
            <span>The Connoisseur’s Burn Test Protocol</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Real silk leaves a fine, brittle black ash that crushes to powder instantly with the scent of singed hair, while imitation art-silk forms a hard, chemical plastic bead. We include an authentic yarn scrap with your heirloom for your personal verification.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-[11px] font-mono text-text-tertiary text-center sm:text-left">
            Serial Number assigned upon loom completion · Archival Mul-Mul packed
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors"
          >
            I UNDERSTAND & CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};
