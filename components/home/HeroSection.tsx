"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TextileCanvas } from "@/components/canvas/TextileCanvas";
import { SAREE_COLLECTION } from "@/lib/catalogData";
import { ArrowDown, Sparkles } from "lucide-react";

export const HeroSection: React.FC = () => {
  const featuredSaree = SAREE_COLLECTION[0];
  const [selectedColorway, setSelectedColorway] = useState(
    featuredSaree.colorways[0]
  );

  return (
    <section className="relative min-h-[95vh] md:min-h-screen flex flex-col justify-between pt-28 pb-12 px-6 md:px-12 overflow-hidden border-b border-surface-border">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-zari/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tagline / Chapter Marker */}
      <div className="max-w-[1720px] mx-auto w-full flex items-center justify-between text-[11px] font-mono tracking-[0.25em] text-text-secondary uppercase">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-zari" />
          <span>INAUGURAL DROP 01</span>
        </div>
        <span>PURE KANCHIPURAM · BANARASI ORGANZA · MATTE ZARI</span>
      </div>

      {/* Centerpiece 50/50 Architecture */}
      <div className="max-w-[1720px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* Left: Typographic Authority */}
        <div className="lg:col-span-6 space-y-6 lg:space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-surface-border bg-canvas-elevated/70 text-[10px] font-mono tracking-widest text-text-secondary">
            <Sparkles className="w-3 h-3 text-accent-zari" />
            <span>EXHIBITION · AUTUMN / WINTER 2026</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-text-primary">
            Wearable <br />
            <span className="italic font-light text-text-secondary">
              Architecture.
            </span>
          </h1>

          <p className="font-sans text-base md:text-lg text-text-secondary max-w-lg leading-relaxed font-light">
            Featherweight soft silks and gossamer organzas, stripped of
            extraneous ornament. Woven on traditional pit-looms with antique
            electro-lacquered matte zari.
          </p>

          {/* Colorway Swatch Bar for Live WebGL Mutation */}
          <div className="pt-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block mb-3">
              Live Shader Swatch: {selectedColorway.name}
            </span>
            <div className="flex items-center gap-3">
              {featuredSaree.colorways.map((cw) => (
                <button
                  key={cw.id}
                  onClick={() => setSelectedColorway(cw)}
                  className={`group relative flex items-center gap-2 px-3 py-2 border transition-all duration-300 ${
                    selectedColorway.id === cw.id
                      ? "border-text-primary bg-canvas-elevated shadow-xs"
                      : "border-surface-border bg-canvas-base hover:border-text-secondary"
                  }`}
                  data-cursor="SELECT WEFT"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-surface-border"
                    style={{ backgroundColor: cw.hex }}
                  />
                  <span className="text-[11px] font-mono tracking-wider text-text-primary">
                    {cw.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center gap-5 pt-4">
            <Link
              href={`/sarees/${featuredSaree.slug}`}
              className="bg-text-primary text-canvas-base px-8 py-4 text-xs font-mono tracking-[0.2em] uppercase hover:bg-accent-zari hover:text-text-primary transition-all duration-300 flex items-center gap-3 shadow-md group"
              data-cursor="INSPECT"
            >
              <span>EXPLORE SILHOUETTE</span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>

            <Link
              href="#fabric-lab"
              className="px-6 py-4 text-xs font-mono tracking-[0.2em] uppercase border border-surface-border hover:border-text-primary transition-colors text-text-primary"
            >
              TACTILE FABRIC LAB
            </Link>
          </div>
        </div>

        {/* Right: 3D Interactive WebGL Cloth Viewport */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="relative w-full aspect-[4/5] max-w-[540px] rounded-xs overflow-hidden border border-surface-border/80 shadow-2xl bg-canvas-elevated">
            <TextileCanvas
              colorway={selectedColorway}
              fallbackImage={featuredSaree.images.hero}
              title={featuredSaree.title}
            />
          </div>
        </div>
      </div>

      {/* Bottom Viewport Anchor */}
      <div className="max-w-[1720px] mx-auto w-full flex items-center justify-between pt-6 text-[10px] font-mono tracking-widest text-text-tertiary uppercase">
        <span>KANCHIPURAM LOT NO. 01/2026</span>
        <a
          href="#curated-drop"
          className="flex items-center gap-2 hover:text-text-primary transition-colors"
        >
          <span>SCROLL TO DISCOVER</span>
          <ArrowDown className="w-3 h-3 animate-bounce" />
        </a>
        <span>EST. 2026 · ALL TEXTILES CERTIFIED</span>
      </div>
    </section>
  );
};
