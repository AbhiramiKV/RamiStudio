"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SAREE_COLLECTION } from "@/lib/catalogData";
import { useCartStore } from "@/lib/stores/cartStore";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export const CuratedDrop: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { formatPrice } = useCartStore();

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  const scrollByAmount = (distance: number) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <section
      id="curated-drop"
      className="py-24 md:py-32 px-6 md:px-12 bg-canvas-base border-b border-surface-border overflow-hidden"
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block mb-2">
              The Master Loom Archive · Autumn / Winter 2026
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-text-primary">
              Limited Handloom Heirlooms
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-xs font-mono text-text-secondary uppercase tracking-widest hidden sm:block">
              {SAREE_COLLECTION.length} SINGLE-BATCH LOOM EDITIONS
            </p>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollByAmount(-440)}
                className="p-3 border border-surface-border hover:border-text-primary hover:bg-canvas-elevated transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 text-text-primary" />
              </button>
              <button
                onClick={() => scrollByAmount(440)}
                className="p-3 border border-surface-border hover:border-text-primary hover:bg-canvas-elevated transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 text-text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrub Track */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-5 sm:gap-8 overflow-x-auto scrollbar-none pb-8 pt-2 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {SAREE_COLLECTION.map((saree) => (
            <div
              key={saree.id}
              className="w-[82vw] max-w-[340px] sm:w-[380px] md:w-[440px] flex-shrink-0 group flex flex-col justify-between"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Image Container with Hover Micro-Zoom */}
              <div className="relative aspect-[3/4] w-full bg-canvas-elevated overflow-hidden border border-surface-border">
                <Link
                  href={`/sarees/${saree.slug}`}
                  data-cursor="INSPECT"
                  className="block w-full h-full"
                >
                  <Image
                    src={saree.images.hero}
                    alt={saree.title}
                    fill
                    sizes="(max-width: 768px) 82vw, 440px"
                    className="object-cover transition-transform duration-700 ease-silk-out group-hover:scale-105"
                  />
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  <span className="text-[10px] font-mono tracking-widest text-text-primary bg-canvas-base/85 backdrop-blur-md px-2.5 py-1 border border-surface-border uppercase">
                    EDITION {saree.editionNumber}
                  </span>
                  {saree.badge && (
                    <span className="text-[9px] font-mono tracking-widest text-accent-zari-hover bg-canvas-base/85 backdrop-blur-md px-2 py-0.5 border border-accent-zari/40 uppercase">
                      {saree.badge}
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 pointer-events-none flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono tracking-widest text-text-primary bg-canvas-base/85 backdrop-blur-md px-2.5 py-1 border border-surface-border">
                    {saree.specs.weightGrams}g
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-text-tertiary bg-canvas-base/85 backdrop-blur-md px-2 py-0.5 border border-surface-border">
                    {saree.specs.gsm} GSM
                  </span>
                </div>

                {/* Direct View Saree Trigger */}
                <Link
                  href={`/sarees/${saree.slug}`}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-canvas-base/90 backdrop-blur-md text-text-primary px-3.5 py-2 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 border border-surface-border hover:bg-accent-zari hover:text-text-primary transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-md"
                  aria-label={`View ${saree.title}`}
                  data-cursor="INSPECT"
                >
                  <span>INSPECT WEAVE</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Text Meta */}
              <div className="pt-6 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <Link
                      href={`/sarees/${saree.slug}`}
                      className="font-serif text-2xl text-text-primary group-hover:underline transition-all"
                    >
                      {saree.title}
                    </Link>
                    <div className="text-xs font-mono text-accent-zari-hover">
                      {saree.culturalName}
                    </div>
                  </div>
                  <span className="font-mono text-sm font-medium text-text-primary">
                    {formatPrice(saree.priceUSD)}
                  </span>
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-light">
                  {saree.subTitle}
                </p>

                <div className="text-[10px] font-mono text-text-tertiary">
                  By Master Artisan {saree.provenance.masterArtisan} · {saree.provenance.villageCluster}
                </div>

                {/* Colorway preview swatches & direct link */}
                <div className="flex items-center justify-between pt-3 border-t border-surface-border/60">
                  <div className="flex items-center gap-1.5">
                    {saree.colorways.map((cw) => (
                      <span
                        key={cw.id}
                        className="w-3 h-3 rounded-full border border-surface-border"
                        style={{ backgroundColor: cw.hex }}
                        title={cw.name}
                      />
                    ))}
                    <span className="text-[10px] font-mono text-text-tertiary ml-1">
                      {saree.colorways.length} TONES
                    </span>
                  </div>

                  <Link
                    href={`/sarees/${saree.slug}`}
                    className="text-[11px] font-mono tracking-widest text-text-secondary group-hover:text-text-primary flex items-center gap-1 uppercase transition-colors"
                  >
                    <span>VIEW PIECE</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Track Progress Indicator */}
        <div className="w-full h-[2px] bg-surface-border mt-8 overflow-hidden">
          <div
            className="h-full bg-text-primary transition-all duration-300 ease-out"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          />
        </div>
      </div>
    </section>
  );
};
