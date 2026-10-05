"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SAREES_CATALOG } from "@/lib/catalogData";
import { useCartStore } from "@/lib/stores/cartStore";
import { Filter, ArrowUpDown, Sparkles } from "lucide-react";

export const CollectionClient: React.FC = () => {
  const { formatPrice } = useCartStore();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [selectedWeight, setSelectedWeight] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const regions = useMemo(() => {
    const list = Array.from(new Set(SAREES_CATALOG.map((s) => s.specs.originRegion.split(",")[0].trim())));
    return ["all", ...list];
  }, []);

  const filteredSarees = useMemo(() => {
    return SAREES_CATALOG.filter((saree) => {
      const regionName = saree.specs.originRegion.split(",")[0].trim();
      if (selectedRegion !== "all" && regionName !== selectedRegion) {
        return false;
      }
      if (selectedOccasion !== "all") {
        if (!saree.auspiciousOccasions.some((occ) => occ.toLowerCase().includes(selectedOccasion.toLowerCase()))) {
          return false;
        }
      }
      if (selectedWeight !== "all") {
        const grams = saree.specs.weightGrams;
        if (selectedWeight === "feather" && grams > 550) return false;
        if (selectedWeight === "medium" && (grams <= 550 || grams > 800)) return false;
        if (selectedWeight === "heavy" && grams <= 800) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceUSD - b.priceUSD;
      if (sortBy === "price-desc") return b.priceUSD - a.priceUSD;
      return 0;
    });
  }, [selectedRegion, selectedOccasion, selectedWeight, sortBy]);

  return (
    <div className="pt-32 pb-32 px-4 sm:px-6 md:px-12 max-w-[1720px] mx-auto space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-surface-border pb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-accent-zari-hover uppercase">
          <Sparkles className="w-3.5 h-3.5 text-accent-zari" />
          <span>Haute Handloom Maison Archive</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-text-primary tracking-tight font-light">
              Master Saree Collection
            </h1>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
              Each piece represents between 180 and 420 hours of single-artisan pit-loom tension. Woven with double-warp 3-ply Mulberry silk and certified electro-lacquered pure silver zari.
            </p>
          </div>

          <div className="text-xs font-mono text-text-tertiary uppercase tracking-widest">
            <span>Showing {filteredSarees.length} of {SAREES_CATALOG.length} Loom Editions</span>
          </div>
        </div>
      </div>

      {/* Filter & Sort Controls */}
      <div className="bg-canvas-elevated border border-surface-border p-4 rounded-xs flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Filter className="w-3.5 h-3.5 text-accent-zari" />
            <span className="uppercase tracking-wider">Region:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xs transition-colors uppercase tracking-wider ${
                  selectedRegion === reg
                    ? "bg-text-primary text-canvas-base font-medium"
                    : "bg-canvas-base border border-surface-border text-text-secondary hover:border-text-primary"
                }`}
              >
                {reg === "all" ? "All Guilds" : reg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary uppercase">Occasion:</span>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="bg-canvas-base border border-surface-border p-1.5 text-text-primary text-xs focus:outline-none"
            >
              <option value="all">All Ceremonies</option>
              <option value="wedding">Bridal Muhurtham</option>
              <option value="reception">Evening Reception</option>
              <option value="gala">Diplomatic Gala</option>
              <option value="festive">Festive Soirée</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-secondary uppercase">Weight:</span>
            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              className="bg-canvas-base border border-surface-border p-1.5 text-text-primary text-xs focus:outline-none"
            >
              <option value="all">All Weights</option>
              <option value="feather">Featherweight (&lt;550g)</option>
              <option value="medium">Classic Medium (550-800g)</option>
              <option value="heavy">Heirloom Heavy (&gt;800g)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-accent-zari" />
            <span className="text-text-secondary uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")
              }
              className="bg-canvas-base border border-surface-border p-1.5 text-text-primary text-xs focus:outline-none"
            >
              <option value="featured">Archival Drop Order</option>
              <option value="price-asc">Price: Ascending</option>
              <option value="price-desc">Price: Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saree Grid */}
      {filteredSarees.length === 0 ? (
        <div className="p-16 text-center space-y-4 bg-canvas-elevated border border-surface-border rounded-xs">
          <h3 className="font-serif text-2xl text-text-primary">No Sarees In This Selection</h3>
          <p className="text-xs text-text-secondary font-mono">
            Adjust your region or weight filters to view available loom editions.
          </p>
          <button
            onClick={() => {
              setSelectedRegion("all");
              setSelectedWeight("all");
            }}
            className="px-6 py-2.5 bg-text-primary text-canvas-base text-xs font-mono uppercase tracking-widest"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredSarees.map((saree) => (
            <Link
              key={saree.id}
              href={`/sarees/${saree.slug}`}
              className="group flex flex-col bg-canvas-base border border-surface-border rounded-xs overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-text-primary"
            >
              {/* Product Visual Container */}
              <div className="relative aspect-[3/4] w-full bg-canvas-elevated overflow-hidden">
                <Image
                  src={saree.images.hero}
                  alt={saree.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono tracking-widest px-2 py-1 bg-canvas-base/90 backdrop-blur-md border border-surface-border text-text-primary uppercase">
                    {saree.certification.craftClusterRegNo}
                  </span>
                  <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 bg-accent-zari/20 backdrop-blur-md border border-accent-zari/40 text-accent-zari-hover uppercase">
                    {saree.specs.weightGrams}g / {saree.specs.gsm} GSM
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] font-mono tracking-wider px-2.5 py-1 bg-canvas-base/95 backdrop-blur-md border border-surface-border text-text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Inspect Saree →
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase flex items-center justify-between">
                    <span>{saree.specs.originRegion.split(",")[0]}</span>
                    <span>{saree.specs.loomType.split("(")[0].trim()}</span>
                  </div>
                  <h3 className="font-serif text-lg text-text-primary group-hover:text-accent-zari transition-colors">
                    {saree.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 font-light leading-relaxed">
                    {saree.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-text-tertiary block">
                      Price DDP Insured
                    </span>
                    <span className="font-mono text-base font-medium text-text-primary">
                      {formatPrice(saree.priceUSD)}
                    </span>
                  </div>

                  {/* Colorway Dots */}
                  <div className="flex items-center gap-1.5">
                    {saree.colorways.map((c) => (
                      <span
                        key={c.id}
                        className="w-3.5 h-3.5 rounded-full border border-surface-border"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
