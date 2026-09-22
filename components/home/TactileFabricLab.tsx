"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCanvasStore, LightingMode } from "@/lib/stores/canvasStore";
import { SwatchBoxModal } from "@/components/trust/SwatchBoxModal";
import { Sun, Flame, Sparkles, ZoomIn, Info, Package, ShieldCheck } from "lucide-react";

export const TactileFabricLab: React.FC = () => {
  const [selectedWeight, setSelectedWeight] = useState<64 | 210>(210);
  const { lightingMode, setLightingMode } = useCanvasStore();
  const [macroZoom, setMacroZoom] = useState(false);
  const [isSwatchOpen, setIsSwatchOpen] = useState(false);

  const fabrics = {
    64: {
      name: "Featherweight Banarasi Silk Organza",
      gsm: 64,
      weightGrams: 310,
      drapeFeel: "Floating, ethereal, crisp memory hold with zero deadweight sag.",
      transparency: "Gossamer Translucent (80% Light Transmission)",
      warpWeft: "20/22 Denier High-Twist Katan Organza",
      zariType: "Sub-micron Electro-oxidized Antique Pale Gold",
      origin: "Varanasi, Uttar Pradesh",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
      macroImage: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop",
    },
    210: {
      name: "Heavy Pure Mulberry Kanchipuram Silk",
      gsm: 210,
      weightGrams: 685,
      drapeFeel: "Stately, architectural cascades that hold sculptural knife-pleats all day.",
      transparency: "Opaque (Zero Translucency, Pure Light Absorption)",
      warpWeft: "2/120s Degummed Mulberry Silk × 3-Ply Filature Weft",
      zariType: "Certified 1.8g Silver-Plated Electro-lacquered Matte Zari",
      origin: "Chinna Kanchipuram, Tamil Nadu",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
      macroImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop",
    },
  };

  const currentFabric = fabrics[selectedWeight];

  return (
    <section
      id="fabric-lab"
      className="py-24 md:py-32 px-6 md:px-12 bg-canvas-elevated border-b border-surface-border"
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Lab Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-zari" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary">
                Artisanal Integrity & Purity Standards
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-text-primary">
              The Connoisseur’s Weave Guide
            </h2>
          </div>

          <p className="text-xs text-text-secondary font-mono uppercase tracking-widest max-w-md">
            Compare hand-spun silk densities, drape weight in grams, and silver zari purity before acquiring.
          </p>
        </div>

        {/* Split Screen Comparator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Visual & Macro Inspector */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="relative aspect-[16/10] w-full bg-canvas-base border border-surface-border overflow-hidden rounded-xs group shadow-lg">
              <Image
                src={macroZoom ? currentFabric.macroImage : currentFabric.image}
                alt={currentFabric.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className={`object-cover transition-all duration-700 ease-silk-out ${
                  macroZoom ? "scale-125" : "scale-100"
                }`}
                style={{
                  filter:
                    lightingMode === "candlelight"
                      ? "sepia(0.2) saturate(1.2) brightness(0.95)"
                      : lightingMode === "daylight"
                      ? "contrast(1.05) brightness(1.02)"
                      : "none",
                }}
              />

              {/* Macro Zoom Overlay Tag */}
              <button
                onClick={() => setMacroZoom(!macroZoom)}
                className="absolute top-4 left-4 bg-canvas-base/85 backdrop-blur-md px-3 py-1.5 border border-surface-border text-[11px] font-mono tracking-widest text-text-primary flex items-center gap-2 hover:bg-canvas-base transition-colors"
                data-cursor={macroZoom ? "RESET 1X" : "MACRO 4X"}
              >
                <ZoomIn className="w-3.5 h-3.5 text-accent-zari" />
                <span>{macroZoom ? "4X MACRO ACTIVE" : "TOGGLE 4X WEAVE ZOOM"}</span>
              </button>

              {/* Lighting State Display Badge */}
              <div className="absolute bottom-4 right-4 bg-canvas-base/85 backdrop-blur-md px-3 py-1.5 border border-surface-border text-[10px] font-mono tracking-widest text-text-secondary uppercase">
                LIGHT: {lightingMode}
              </div>
            </div>

            {/* Lighting Mode Switcher Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-canvas-base border border-surface-border">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-text-secondary uppercase flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-accent-zari flex-shrink-0" />
                <span>Ambient Lighting:</span>
              </span>

              <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2">
                {(
                  [
                    { id: "studio", label: "Studio", full: "Studio CRI-98", icon: Sparkles },
                    { id: "candlelight", label: "Candle", full: "Evening Candlelight", icon: Flame },
                    { id: "daylight", label: "Sunlight", full: "Temple Sunlight", icon: Sun },
                  ] as { id: LightingMode; label: string; full: string; icon: React.ComponentType<{ className?: string }> }[]
                ).map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setLightingMode(mode.id)}
                      data-lighting-mode={mode.id}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-2 sm:py-1.5 text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors border rounded-xs min-h-[36px] ${
                        lightingMode === mode.id
                          ? "bg-text-primary text-canvas-base border-text-primary font-medium"
                          : "bg-canvas-elevated text-text-secondary border-surface-border hover:border-text-primary"
                      }`}
                    >
                      <Icon className="w-3 h-3 flex-shrink-0" />
                      <span className="sm:hidden">{mode.label}</span>
                      <span className="hidden sm:inline">{mode.full}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Weight Specification Matrix */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Weight Switcher Tabs */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-canvas-base border border-surface-border">
              <button
                onClick={() => setSelectedWeight(210)}
                className={`py-3 px-4 text-left transition-all ${
                  selectedWeight === 210
                    ? "bg-canvas-elevated text-text-primary border border-surface-border shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <div className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase">
                  STATELY KORVAI
                </div>
                <div className="font-serif text-lg text-text-primary mt-1">
                  685g · 210 GSM Silk
                </div>
              </button>

              <button
                onClick={() => setSelectedWeight(64)}
                className={`py-3 px-4 text-left transition-all ${
                  selectedWeight === 64
                    ? "bg-canvas-elevated text-text-primary border border-surface-border shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <div className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase">
                  FEATHERWEIGHT ORGANZA
                </div>
                <div className="font-serif text-lg text-text-primary mt-1">
                  310g · 64 GSM Tissue
                </div>
              </button>
            </div>

            {/* Spec Breakdown Table */}
            <div className="bg-canvas-base border border-surface-border p-6 space-y-5 flex-1">
              <div>
                <h3 className="font-serif text-2xl text-text-primary mb-1">
                  {currentFabric.name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed font-light">
                  {currentFabric.drapeFeel}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-surface-border/70 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                  <span className="text-text-tertiary uppercase tracking-wider">
                    Total Saree Weight
                  </span>
                  <span className="text-text-primary font-medium">
                    {currentFabric.weightGrams} Grams ({currentFabric.gsm} g/m²)
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                  <span className="text-text-tertiary uppercase tracking-wider">
                    Translucency
                  </span>
                  <span className="text-text-primary">
                    {currentFabric.transparency}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                  <span className="text-text-tertiary uppercase tracking-wider">
                    Filament Weft
                  </span>
                  <span className="text-text-primary">
                    {currentFabric.warpWeft}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                  <span className="text-text-tertiary uppercase tracking-wider">
                    Zari Metallurgy
                  </span>
                  <span className="text-accent-zari-hover">
                    {currentFabric.zariType}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-text-tertiary uppercase tracking-wider">
                    Provenance
                  </span>
                  <span className="text-text-primary">
                    {currentFabric.origin}
                  </span>
                </div>
              </div>
            </div>

            {/* Tactile Swatch Archive CTA Card */}
            <div className="p-4 bg-canvas-base border border-surface-border flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-zari" />
                  <span>100% UNTREATED NATURAL PROTEIN SILK · SILK MARK CERTIFIED</span>
                </span>
                <p className="text-[11px] text-text-tertiary">
                  Want to feel the silk drape at home? Order our 4-swatch physical archive.
                </p>
              </div>

              <button
                onClick={() => setIsSwatchOpen(true)}
                className="px-4 py-2 bg-text-primary text-canvas-base text-[10px] font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Package className="w-3.5 h-3.5" />
                <span>SWATCH KIT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <SwatchBoxModal
        isOpen={isSwatchOpen}
        onClose={() => setIsSwatchOpen(false)}
      />
    </section>
  );
};

