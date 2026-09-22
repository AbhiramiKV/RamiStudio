"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SareeProduct, Colorway } from "@/lib/types";
import { TextileCanvas } from "@/components/canvas/TextileCanvas";
import { useCartStore } from "@/lib/stores/cartStore";
import { useCanvasStore, LightingMode } from "@/lib/stores/canvasStore";
import {
  Sparkles,
  Flame,
  Sun,
  Layers,
  ZoomIn,
  ShieldCheck,
  RotateCw,
  Check,
  ChevronRight,
  ArrowLeft,
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
  const [withBlouse, setWithBlouse] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const { addItem, formatPrice } = useCartStore();
  const { lightingMode, setLightingMode } = useCanvasStore();

  React.useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToBag = () => {
    addItem(saree, selectedColorway, withBlouse);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const totalPriceUSD =
    saree.priceUSD + (withBlouse ? saree.blouseOption.priceUSD : 0);

  return (
    <div className="pt-28 pb-32 px-6 md:px-12 max-w-[1720px] mx-auto">
      {/* Breadcrumb & Edition Counter */}
      <nav className="flex items-center justify-between text-[11px] font-mono tracking-widest text-text-secondary uppercase mb-8 border-b border-surface-border/70 pb-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>COLLECTION</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-text-tertiary" />
          <span className="text-text-primary">{saree.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <span>EDITION {saree.editionNumber}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{saree.specs.originRegion}</span>
        </div>
      </nav>

      {/* 50/50 Desktop Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: Sticky 3D WebGL / Macro Viewer */}
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
                  8X MACRO WEAVE TEXTURE
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
            <div className="absolute top-4 right-4 flex items-center gap-2">
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
                8X MACRO
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
          </div>

          {/* Interactive Lighting Switcher & Thumbnail Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-canvas-elevated border border-surface-border">
            {/* Lighting modes */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase mr-1">
                SHOCK LIGHT:
              </span>
              {(
                [
                  { id: "studio", label: "Studio", icon: Sparkles },
                  { id: "candlelight", label: "Candlelight", icon: Flame },
                  { id: "daylight", label: "Daylight", icon: Sun },
                ] as { id: LightingMode; label: string; icon: any }[]
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
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Photo thumbnails if in lookbook mode */}
            <div className="flex items-center gap-2">
              {Object.entries(saree.images).map(([key, url]) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Flowing Narrative, Technical Specs & Commerce */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header Title & Pricing */}
          <div className="space-y-3 pb-6 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-secondary">
                {saree.specs.loomType}
              </span>
              {saree.badge && (
                <span className="text-[9px] font-mono tracking-widest text-accent-zari-hover px-2 py-0.5 border border-accent-zari/40 uppercase">
                  {saree.badge}
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-text-primary leading-tight">
              {saree.title}
            </h1>

            <p className="font-serif text-lg text-text-secondary italic font-light">
              {saree.subTitle}
            </p>

            <div className="pt-2 flex items-baseline gap-4">
              <span className="font-mono text-2xl font-medium text-text-primary">
                {formatPrice(totalPriceUSD)}
              </span>
              <span className="text-[11px] font-mono tracking-widest text-text-tertiary uppercase">
                DUTIES & EXPRESS DHL INCLUDED
              </span>
            </div>
          </div>

          {/* Colorway Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-tertiary uppercase tracking-widest">
                Selected Weft Tone:
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
                      Dual-tone weft
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Narrative Copy & Philosophy */}
          <div className="space-y-4 text-sm text-text-secondary leading-relaxed font-light">
            <p>{saree.description}</p>
            <blockquote className="pl-4 border-l-2 border-accent-zari italic font-serif text-base text-text-primary">
              "{saree.philosophy}"
            </blockquote>
          </div>

          {/* Blouse Pairing Module */}
          <div className="p-5 bg-canvas-elevated border border-surface-border space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-accent-zari-hover uppercase block">
                  OPTIONAL BLOUSE PAIRING
                </span>
                <h4 className="font-serif text-base text-text-primary">
                  {saree.blouseOption.title}
                </h4>
                <p className="text-xs text-text-secondary">
                  {saree.blouseOption.fabric}
                </p>
              </div>

              <span className="font-mono text-xs font-medium text-text-primary whitespace-nowrap">
                +{formatPrice(saree.blouseOption.priceUSD)}
              </span>
            </div>

            <button
              onClick={() => setWithBlouse(!withBlouse)}
              className={`w-full py-2 px-3 border text-xs font-mono tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
                withBlouse
                  ? "bg-text-primary text-canvas-base border-text-primary"
                  : "bg-canvas-base text-text-secondary border-surface-border hover:border-text-primary"
              }`}
            >
              {withBlouse ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>BLOUSE PIECE INCLUDED IN BAG</span>
                </>
              ) : (
                <span>+ ADD BLOUSE PIECE TO ORDER</span>
              )}
            </button>
          </div>

          {/* Action Group: Sticky Add to Bag */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToBag}
              className="w-full bg-text-primary text-canvas-base py-4 px-6 text-xs font-mono tracking-[0.22em] uppercase hover:bg-accent-zari hover:text-text-primary transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group"
              data-cursor="ADD TO BAG"
            >
              <span>
                {addedAnimation ? "PIECE ADDED TO BAG" : "ACQUIRE SILHOUETTE"}
              </span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-text-tertiary">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-zari" />
                <span>CERTIFIED SILK MARK</span>
              </div>
              <span>·</span>
              <div>SHIPS WITHIN 48 HOURS</div>
              <span>·</span>
              <div>GLOBAL CONCIERGE</div>
            </div>
          </div>

          {/* Technical Weave Specification Table */}
          <div className="space-y-4 pt-6 border-t border-surface-border">
            <h3 className="text-xs font-mono tracking-widest uppercase text-text-primary">
              Textile Metrology & Loom Specifications
            </h3>

            <div className="bg-canvas-base border border-surface-border divide-y divide-surface-border/60 text-xs font-mono">
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Surface Weight (GSM)</span>
                <span className="text-text-primary font-medium">{saree.specs.gsm} g/m²</span>
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
                <span className="text-text-tertiary uppercase">Composition</span>
                <span className="text-text-primary">{saree.specs.composition}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Zari Metallurgy</span>
                <span className="text-accent-zari-hover font-medium">{saree.specs.zariPurity}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Loom Architecture</span>
                <span className="text-text-primary">{saree.specs.loomType}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Loom Weave Duration</span>
                <span className="text-text-primary">{saree.specs.weaveTimeDays} Artisan Days</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-text-tertiary uppercase">Transparency Class</span>
                <span className="text-text-primary">{saree.specs.transparency}</span>
              </div>
            </div>
          </div>

            {/* Preservation Protocol */}
            <div className="p-4 bg-canvas-elevated border border-surface-border space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-text-secondary uppercase block">
                Conservation & Archival Storage
              </span>
              <p className="text-xs text-text-tertiary leading-relaxed">
                Delivered wrapped in unbleached mul-mul cotton cloth inside an acid-free cedar box. Refold along natural weft lines every six months. Never hang on metal wire hangers.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Buy Bar with Safe-Area insets */}
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
                  {formatPrice(totalPriceUSD)}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary truncate">
                  · {selectedColorway.name.split(" ")[0]}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToBag}
              className="bg-text-primary text-canvas-base px-5 py-2.5 text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-1.5 flex-shrink-0 rounded-xs shadow-sm min-h-[44px]"
              aria-label="Acquire Silhouette"
            >
              <span>{addedAnimation ? "ADDED" : "ACQUIRE"}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
