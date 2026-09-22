"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SareeProduct, Colorway, SareeCustomizations } from "@/lib/types";
import { TextileCanvas } from "@/components/canvas/TextileCanvas";
import { useCartStore } from "@/lib/stores/cartStore";
import { useCanvasStore, LightingMode } from "@/lib/stores/canvasStore";
import { SilkMarkModal } from "@/components/trust/SilkMarkModal";
import { SwatchBoxModal } from "@/components/trust/SwatchBoxModal";
import { SareeCustomizationModal } from "@/components/saree-services/SareeCustomizationModal";
import { DrapeVideoModal } from "@/components/pdp/DrapeVideoModal";
import { WhatsAppConcierge } from "@/components/concierge/WhatsAppConcierge";
import {
  Sparkles,
  Flame,
  Sun,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Video,
  Scissors,
  Package,
  Star,
} from "lucide-react";

interface ProductDetailClientProps {
  saree: SareeProduct;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  saree,
}) => {
  const [selectedColorway, setSelectedColorway] = useState<Colorway>(
    saree.colorways[0]
  );
  const [activeView, setActiveView] = useState<"3d" | "macro" | "photo">("3d");
  const [selectedPhoto, setSelectedPhoto] = useState<string>(saree.images.hero);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Modals state
  const [isSilkMarkOpen, setIsSilkMarkOpen] = useState(false);
  const [isSwatchOpen, setIsSwatchOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Saree Customizations state
  const [customizations, setCustomizations] = useState<SareeCustomizations>({
    fallPico: "hand-stitched-free",
    blouse: {
      enabled: false,
      styleOption: "unstitched",
      priceUSD: saree.blouseOption.priceUSD,
    },
  });

  const { addItem, formatPrice } = useCartStore();
  const { lightingMode, setLightingMode } = useCanvasStore();

  React.useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate current total price including customizations
  const calculateCurrentPriceUSD = () => {
    let price = saree.priceUSD;
    if (customizations.fallPico === "silk-rolled") price += 15;
    if (customizations.blouse.enabled) {
      price += customizations.blouse.priceUSD;
    }
    if (customizations.petticoat?.enabled) {
      price += customizations.petticoat.priceUSD;
    }
    if (customizations.tassels?.enabled) {
      price += customizations.tassels.priceUSD;
    }
    if (customizations.prePleated?.enabled) {
      price += customizations.prePleated.priceUSD;
    }
    return price;
  };

  const currentPriceUSD = calculateCurrentPriceUSD();

  const handleAddToBag = () => {
    addItem(saree, selectedColorway, customizations.blouse.enabled, customizations);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="pt-28 pb-32 px-4 sm:px-6 md:px-12 max-w-[1720px] mx-auto">
      {/* Breadcrumb & Lineage Badge */}
      <nav className="flex flex-wrap items-center justify-between text-[11px] font-mono tracking-widest text-text-secondary uppercase mb-8 border-b border-surface-border/70 pb-4 gap-2">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>COLLECTION</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-text-tertiary" />
          <span className="text-text-primary">{saree.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-accent-zari-hover font-medium">EDITION {saree.editionNumber}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{saree.provenance.villageCluster}</span>
          <span>·</span>
          <span className="text-text-primary">{saree.specs.weightGrams}g WEAVE</span>
        </div>
      </nav>

      {/* 50/50 Desktop Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: Sticky 3D WebGL / Macro / Video Stage */}
        <div className="lg:col-span-7 lg:sticky lg:top-28 space-y-4">
          <div className="relative aspect-[3/4] w-full bg-canvas-elevated border border-surface-border overflow-hidden rounded-xs shadow-xl">
            {activeView === "3d" ? (
              <TextileCanvas
                colorway={selectedColorway}
                fallbackImage={saree.images.hero}
                title={saree.title}
              />
            ) : activeView === "macro" ? (
              <div className="relative w-full h-full cursor-zoom-in">
                <Image
                  src={saree.images.macro}
                  alt={`${saree.title} Weave Macro`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover scale-150 transition-transform duration-700"
                  priority
                />
                <div className="absolute top-4 left-4 bg-canvas-base/85 backdrop-blur-md px-3 py-1.5 border border-surface-border text-[10px] font-mono tracking-widest text-text-primary">
                  100% UNTREATED NATURAL SILK MACRO WEAVE
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={selectedPhoto}
                  alt={saree.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Viewport Control Badges */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveView("3d")}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-colors border ${
                  activeView === "3d"
                    ? "bg-text-primary text-canvas-base border-text-primary"
                    : "bg-canvas-base/85 backdrop-blur-md text-text-secondary border-surface-border hover:text-text-primary"
                }`}
              >
                3D DRAPE
              </button>
              <button
                onClick={() => setActiveView("macro")}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-colors border ${
                  activeView === "macro"
                    ? "bg-text-primary text-canvas-base border-text-primary"
                    : "bg-canvas-base/85 backdrop-blur-md text-text-secondary border-surface-border hover:text-text-primary"
                }`}
              >
                MACRO
              </button>
              <button
                onClick={() => setActiveView("photo")}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-colors border ${
                  activeView === "photo"
                    ? "bg-text-primary text-canvas-base border-text-primary"
                    : "bg-canvas-base/85 backdrop-blur-md text-text-secondary border-surface-border hover:text-text-primary"
                }`}
              >
                LOOKBOOK
              </button>
            </div>

            {/* 4K Video Trigger Pill */}
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="absolute bottom-4 left-4 bg-text-primary/90 hover:bg-accent-zari text-canvas-base hover:text-text-primary px-3.5 py-2 rounded-xs border border-surface-border backdrop-blur-md text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 transition-all shadow-lg"
            >
              <Video className="w-3.5 h-3.5" />
              <span>WATCH 4K DRAPE WALKTHROUGH</span>
            </button>
          </div>

          {/* Lighting Mode Selector & Thumbnail Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-canvas-elevated border border-surface-border">
            {/* Lighting Modes */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase mr-1">
                AMBIENT LIGHT:
              </span>
              {(
                [
                  { id: "studio", label: "Studio CRI-98", icon: Sparkles },
                  { id: "candlelight", label: "Evening Candlelight", icon: Flame },
                  { id: "daylight", label: "Temple Sunlight", icon: Sun },
                ] as { id: LightingMode; label: string; icon: React.ComponentType<{ className?: string }> }[]
              ).map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setLightingMode(mode.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-wider transition-colors border ${
                      lightingMode === mode.id
                        ? "bg-text-primary text-canvas-base border-text-primary"
                        : "bg-canvas-base text-text-secondary border-surface-border hover:border-text-primary"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{mode.label}</span>
                    <span className="sm:hidden">{mode.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Photo Thumbnails */}
            <div className="flex items-center gap-2">
              {Object.entries(saree.images).map(([key, url]) => {
                if (!url) return null;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedPhoto(url);
                      setActiveView("photo");
                    }}
                    className={`relative w-10 h-12 border overflow-hidden transition-all ${
                      selectedPhoto === url && activeView === "photo"
                        ? "border-text-primary scale-105"
                        : "border-surface-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={key}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Flowing Narrative, Technical Specs & Commerce */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header Title & Pricing */}
          <div className="space-y-3 pb-6 border-b border-surface-border">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono text-accent-zari-hover font-medium uppercase tracking-widest">
                {saree.culturalName}
              </span>

              <button
                onClick={() => setIsSilkMarkOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-accent-zari/40 bg-accent-zari/10 text-accent-zari-hover text-[10px] font-mono tracking-widest hover:bg-accent-zari hover:text-canvas-base transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SILK MARK CERTIFIED</span>
              </button>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-text-primary leading-tight">
              {saree.title}
            </h1>

            <p className="font-serif text-base sm:text-lg text-text-secondary italic font-light">
              {saree.subTitle}
            </p>

            <div className="pt-2 flex flex-wrap items-baseline gap-4">
              <span className="font-mono text-2xl font-medium text-text-primary">
                {formatPrice(currentPriceUSD)}
              </span>
              <span className="text-[11px] font-mono tracking-widest text-text-tertiary uppercase">
                COMPLIMENTARY DHL EXPRESS · DUTIES INCLUDED (DDP)
              </span>
            </div>
          </div>

          {/* Colorway Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-tertiary uppercase tracking-widest">
                Hand-Dyed Weft Tone:
              </span>
              <span className="text-text-primary font-medium">
                {selectedColorway.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {saree.colorways.map((cw) => (
                <button
                  key={cw.id}
                  onClick={() => setSelectedColorway(cw)}
                  className={`flex items-center gap-3 p-3 border text-left transition-all ${
                    selectedColorway.id === cw.id
                      ? "border-text-primary bg-canvas-elevated shadow-xs"
                      : "border-surface-border bg-canvas-base hover:border-text-secondary"
                  }`}
                  data-cursor="SWATCH"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-surface-border flex-shrink-0"
                    style={{ backgroundColor: cw.hex }}
                  />
                  <div className="truncate">
                    <div className="text-xs font-mono text-text-primary truncate">
                      {cw.name}
                    </div>
                    <div className="text-[10px] font-mono text-text-tertiary">
                      Authentic Cross-Weft Dye
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Narrative & Soulful Story */}
          <div className="space-y-4 text-sm text-text-secondary leading-relaxed font-light">
            <p>{saree.description}</p>
            <blockquote className="pl-4 border-l-2 border-accent-zari italic font-serif text-base text-text-primary">
              &ldquo;{saree.philosophy}&rdquo;
            </blockquote>
          </div>

          {/* Auspicious Occasions Tags */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase block">
              Curated For Auspicious Occasions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {saree.auspiciousOccasions.map((occ) => (
                <span
                  key={occ}
                  className="px-2.5 py-1 bg-canvas-elevated border border-surface-border text-[11px] font-mono text-text-secondary rounded-xs"
                >
                  {occ}
                </span>
              ))}
            </div>
          </div>

          {/* Saree Customization Suite Trigger Card */}
          <div className="p-5 bg-canvas-elevated border border-surface-border space-y-3 rounded-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-accent-zari-hover uppercase block">
                  ATELIER BESPOKE SERVICES
                </span>
                <h4 className="font-serif text-lg text-text-primary">
                  Fall, Pico & Tailored Blouse Studio
                </h4>
                <p className="text-xs text-text-secondary font-light">
                  Hand-stitched cotton fall, pre-pleated waist hooks, matching mermaid silhouette shaper, and custom neckline blouse tailoring.
                </p>
              </div>

              <button
                onClick={() => setIsCustomizationOpen(true)}
                className="px-4 py-2 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-1.5 rounded-xs flex-shrink-0 shadow-sm"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>CUSTOMIZE</span>
              </button>
            </div>

            {/* Active Customization Badges */}
            <div className="pt-2 border-t border-surface-border/70 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 bg-canvas-base border border-surface-border text-text-primary">
                Fall & Pico: {customizations.fallPico === "silk-rolled" ? "Silk-Rolled" : "Hand-Stitched Free"}
              </span>
              <span className="px-2 py-0.5 bg-canvas-base border border-surface-border text-text-primary">
                Blouse: {customizations.blouse.enabled ? (customizations.blouse.styleOption === "custom-tailored" ? "Custom Tailored (+65)" : "Unstitched Piece") : "None"}
              </span>
              {customizations.petticoat?.enabled && (
                <span className="px-2 py-0.5 bg-canvas-base border border-surface-border text-text-primary">
                  Mermaid Shaper (Size {customizations.petticoat.waistSize})
                </span>
              )}
              {customizations.prePleated?.enabled && (
                <span className="px-2 py-0.5 bg-canvas-base border border-surface-border text-text-primary">
                  Pre-Pleated ({customizations.prePleated.waistInches} in.)
                </span>
              )}
            </div>
          </div>

          {/* Action Group: Acquire & Add to Bag */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToBag}
              className="w-full bg-text-primary text-canvas-base py-4 px-6 text-xs font-mono tracking-[0.22em] uppercase hover:bg-accent-zari hover:text-text-primary transition-all duration-300 flex items-center justify-center gap-3 shadow-xl group"
              data-cursor="ADD TO BAG"
            >
              <span>
                {addedAnimation ? "PIECE RESERVED IN TROUSSEAU" : "ACQUIRE HEIRLOOM"}
              </span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-text-tertiary">
              <button
                onClick={() => setIsSilkMarkOpen(true)}
                className="flex items-center gap-1 hover:text-text-primary transition-colors underline"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-accent-zari" />
                <span>SILK MARK CERTIFIED #{saree.certification.silkMarkLicenseNo}</span>
              </button>
              <span>·</span>
              <div>SHIPS IN 48 HOURS</div>
              <span>·</span>
              <div>INSURED DHL AIR EXPRESS</div>
            </div>
          </div>

          {/* Master Weaver Provenance Card */}
          <div className="p-5 bg-canvas-base border border-surface-border space-y-3 rounded-xs">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-tertiary uppercase tracking-widest">
                Loom Provenance & Weaver Guild
              </span>
              <span className="text-text-primary font-medium">
                {saree.specs.weaveTimeDays} Artisan Days on Loom
              </span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-surface-border flex-shrink-0">
                <Image
                  src={saree.provenance.portraitUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"}
                  alt={saree.provenance.masterArtisan}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div>
                <h4 className="font-serif text-lg text-text-primary">
                  Master Artisan {saree.provenance.masterArtisan}
                </h4>
                <p className="text-xs text-text-secondary font-light">
                  {saree.provenance.lineage} · {saree.provenance.villageCluster}
                </p>
              </div>
            </div>

            {saree.provenance.quote && (
              <blockquote className="border-l-2 border-accent-zari pl-3 italic text-xs text-text-secondary font-serif pt-1">
                &ldquo;{saree.provenance.quote}&rdquo;
              </blockquote>
            )}
          </div>

          {/* Textile Metrology & Specifications Matrix */}
          <div className="space-y-4 pt-4 border-t border-surface-border">
            <h3 className="text-xs font-mono tracking-widest uppercase text-text-primary">
              Textile Purity & Dimensions Ledger
            </h3>

            <div className="bg-canvas-base border border-surface-border divide-y divide-surface-border/60 text-xs font-mono">
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Total Physical Weight</span>
                <span className="text-text-primary font-medium">{saree.specs.weightGrams} Grams ({saree.specs.gsm} g/m²)</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Dimensions (Length × Width)</span>
                <span className="text-text-primary">{saree.specs.dimensions.sareeLengthMeters}m × {saree.specs.dimensions.sareeWidthInches} Inches (+1.0m Blouse)</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Warp Thread Count</span>
                <span className="text-text-primary">{saree.specs.warpCount}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Weft Thread Count</span>
                <span className="text-text-primary">{saree.specs.weftCount}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Zari Metallurgy</span>
                <span className="text-accent-zari-hover font-medium">{saree.specs.zariPurity}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Loom Architecture</span>
                <span className="text-text-primary">{saree.specs.loomType}</span>
              </div>
            </div>
          </div>

          {/* Verified Customer Reviews */}
          <div className="space-y-4 pt-4 border-t border-surface-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono tracking-widest uppercase text-text-primary">
                Verified Connoisseur Reviews ({saree.reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-accent-zari">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-accent-zari" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {saree.reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-canvas-elevated border border-surface-border rounded-xs space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-serif text-sm font-medium text-text-primary flex items-center gap-2">
                        <span>{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 uppercase">
                            VERIFIED HEIRLOOM ACQUISITION
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-text-tertiary">
                        {rev.location} · {rev.occasion} · {rev.height}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-text-tertiary">{rev.date}</span>
                  </div>

                  <p className="text-text-secondary leading-relaxed font-light">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tactile Swatch Archive Upsell */}
          <div className="p-4 bg-accent-zari/10 border border-accent-zari/40 flex items-center justify-between gap-4 rounded-xs">
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-medium text-text-primary flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-accent-zari" />
                <span>Hesitant about color undertones?</span>
              </div>
              <p className="text-[11px] text-text-secondary font-light">
                Order our physical 4-swatch tactile kit ($25, 100% credited to your purchase).
              </p>
            </div>

            <button
              onClick={() => setIsSwatchOpen(true)}
              className="px-3 py-1.5 bg-canvas-base border border-surface-border hover:border-text-primary text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors"
            >
              ORDER SWATCHES
            </button>
          </div>

          {/* Conservation Protocol */}
          <div className="p-4 bg-canvas-elevated border border-surface-border space-y-2 rounded-xs">
            <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase block">
              Conservation & Generational Preservation
            </span>
            <p className="text-xs text-text-tertiary leading-relaxed font-light">
              Delivered wrapped in unbleached pure mul-mul cotton cloth inside an acid-free cedarwood box with natural dried vetiver sachet. Refold along natural weft lines every six months. Never hang on wire hangers.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Buy Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-canvas-base/95 backdrop-blur-md border-t border-surface-border px-4 py-3 shadow-2xl transition-all duration-300 lg:hidden ${
          showStickyBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-serif text-sm text-text-primary truncate">
              {saree.title}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-xs font-medium text-text-primary">
                {formatPrice(currentPriceUSD)}
              </span>
              <span className="text-[10px] font-mono text-text-tertiary truncate">
                · {selectedColorway.name.split(" ")[0]}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToBag}
            className="bg-text-primary text-canvas-base px-5 py-2.5 text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-1.5 flex-shrink-0 rounded-xs shadow-sm min-h-[44px]"
            aria-label="Acquire Heirloom"
          >
            <span>{addedAnimation ? "ADDED" : "ACQUIRE"}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Trust & Customization Modals */}
      <SilkMarkModal
        isOpen={isSilkMarkOpen}
        onClose={() => setIsSilkMarkOpen(false)}
        saree={saree}
      />

      <SwatchBoxModal
        isOpen={isSwatchOpen}
        onClose={() => setIsSwatchOpen(false)}
      />

      <SareeCustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        saree={saree}
        initialCustomizations={customizations}
        onSave={(newCustomizations) => setCustomizations(newCustomizations)}
      />

      <DrapeVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        saree={saree}
      />

      {/* Floating Concierge */}
      <WhatsAppConcierge saree={saree} />
    </div>
  );
};

