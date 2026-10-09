"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SareeProduct, Colorway, SareeCustomizations } from "@/lib/types";
import { TextileCanvas } from "@/components/canvas/TextileCanvas";
import { RotationalDrape360 } from "@/components/canvas/RotationalDrape360";
import { SixYardRitualStepper } from "@/components/pdp/SixYardRitualStepper";
import { useCartStore } from "@/lib/stores/cartStore";
import { useCanvasStore, LightingMode } from "@/lib/stores/canvasStore";
import { SilkMarkModal } from "@/components/trust/SilkMarkModal";
import { SwatchBoxModal } from "@/components/trust/SwatchBoxModal";
import { SareeCustomizationModal } from "@/components/saree-services/SareeCustomizationModal";
import { DrapeVideoModal } from "@/components/pdp/DrapeVideoModal";
import { ReviewSubmissionModal } from "@/components/pdp/ReviewSubmissionModal";
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
  PenLine,
} from "lucide-react";

interface ProductDetailClientProps {
  saree: SareeProduct;
}

const ANGLE_METROLOGY_PINS: Record<
  number,
  {
    id: number;
    top: string;
    left: string;
    label: string;
    badge: string;
    title: string;
    desc: string;
    metric: string;
  }[]
> = {
  0: [
    {
      id: 1,
      top: "23%",
      left: "40%",
      label: "01. SHOULDER",
      badge: "PIN 01 · SHOULDER ANCHORING",
      title: "Left Clavicle Brooch & Weight Anchor",
      desc: "4 uniform knife pleats pinned neatly to the choli seam with an heirloom pin. Counterbalances the 1.80m cascading pallu without pulling on the neck.",
      metric: "Weight Distribution: 62% Shoulder / 38% Waist · 4 Pinned Pleats",
    },
    {
      id: 2,
      top: "39%",
      left: "54%",
      label: "02. BIAS SWEEP",
      badge: "PIN 02 · BIAS UPARLI SWEEP",
      title: "Continuous 45° Cross-Bust Bias Drape",
      desc: "Sweeps diagonally from right waist across the bosom to left shoulder. The 45° bias grain activates Dhoop-Chhaon twill color shift and exposes subtle midriff contour.",
      metric: "Tension: 14.2 N/m supple bias · Zero chest sagging",
    },
    {
      id: 3,
      top: "56%",
      left: "48%",
      label: "03. PATLI PLEATS",
      badge: "PIN 03 · PATLI KNIFE PLEATS",
      title: "7 Hand-Folded Accordion Pleats",
      desc: "Anchored firmly into the waistband cordon at the center navel. Pure high-twist mulberry silk retains sharp geometric creasing throughout all-day ceremonial wear.",
      metric: "Pleat Depth: 14cm (5.5\") · Cotton Fall Tape Stabilized",
    },
    {
      id: 4,
      top: "73%",
      left: "58%",
      label: "04. PALLU BORDER",
      badge: "PIN 04 · PALLU BORDER CASCADE",
      title: "8.5cm Interlocked Zari Pallu Border",
      desc: "Cascades gracefully along the left flank, revealing the intricate Korvai temple border and certified electro-lacquered pure silver zari.",
      metric: "Zari Purity: 98.2% Silver Wire · 8.5cm Temple Border",
    },
  ],
  1: [
    {
      id: 101,
      top: "32%",
      left: "46%",
      label: "01. CHOLI BACK",
      badge: "CHOLI BACK · DORI & LATKANS",
      title: "Tailored Sweetheart Cutout & Pearl Latkans",
      desc: "Architecturally contoured back choli cutout tied securely with hand-reeled silk dori cords and clustered seed-pearl tassels. Prevents shoulder slipping while highlighting posture.",
      metric: "Bespoke Cut: 4-inch deep teardrop cutout · Reinforced dori loops",
    },
    {
      id: 102,
      top: "65%",
      left: "58%",
      label: "02. BROCADE PALLU",
      badge: "ANCHAL · ZARI END-PIECE",
      title: "1.80m Full Brocade Zari Cascade",
      desc: "The grand end-piece (Anchal) falls unimpeded past the knee, showcasing certified pure silver/gold electro-lacquered zari woven on double-shuttle wooden pit looms.",
      metric: "Drop Length: 1.80m continuous weave · 0 seam allowances",
    },
  ],
  2: [
    {
      id: 201,
      top: "26%",
      left: "50%",
      label: "01. ODDIYANAM",
      badge: "WAISTBAND · KAMARBANDH",
      title: "Antique Gold Waist Cinch & Navel Tuck",
      desc: "The knife pleats are cinched at the center navel by an antique gold Oddiyanam belt, anchoring the fabric firmly into the mul-mul petticoat cordon.",
      metric: "Waist Retention: 38% total garment mass · Zero downward slip",
    },
    {
      id: 202,
      top: "62%",
      left: "46%",
      label: "02. PATLI ARCHITECTURE",
      badge: "KNIFE PLEATS · FALL TAPE",
      title: "7 Razor-Sharp Accordion Pleats",
      desc: "Each pleat is measured to 14cm (5.5 inches) and secured with unbleached hand-stitched cotton fall tape, ensuring crisp sculptural folds that sway fluidly in motion.",
      metric: "Crease Memory: 3-ply high-twist mulberry warp · 7 crisp patli folds",
    },
  ],
  3: [
    {
      id: 301,
      top: "35%",
      left: "45%",
      label: "01. KORVAI DIVIDE",
      badge: "PIT LOOM · SEAMLESS INTERLOCK",
      title: "Two-Artisan Synchronized Throw-Shuttle",
      desc: "Two master weavers toss shuttles in unison across the warp divide so the pure mulberry silk body and heavy metallic zari border interlock without a single seam.",
      metric: "Loom Heritage: 24 Days Crafting · Dual-treadle pit loom",
    },
    {
      id: 302,
      top: "66%",
      left: "60%",
      label: "02. CERTIFIED ZARI",
      badge: "METALLURGY · ELECTRO-LACQUER",
      title: "98.2% Silver Wire with Natural Lacquer",
      desc: "Certified 1.8g pure silver electroplated wire brushed with botanical lacquer to soften metallic glare into a warm heirloom candlelight sheen.",
      metric: "Purity Assay: 98.2% Silver Electroplated · Silk Mark Certified",
    },
  ],
};

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  saree,
}) => {
  const [selectedColorway, setSelectedColorway] = useState<Colorway>(
    saree.colorways[0]
  );
  const [activeView, setActiveView] = useState<"360" | "ritual" | "tactile">("360");
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);
  const [activePinId, setActivePinId] = useState<number | null>(2);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const drapeFrames = [
    {
      label: "FRONT SILHOUETTE",
      subLabel: "0° · Classical Front Balance",
      angleDegrees: 0,
      image: saree.images.modelDrape || saree.images.drape || saree.images.hero,
      pins: ANGLE_METROLOGY_PINS[0] || [],
    },
    {
      label: "PROFILE SWEEP",
      subLabel: "90° · Bias Fall & Flank Contour",
      angleDegrees: 90,
      image: saree.images.hero || saree.images.modelDrape || saree.images.drape,
      pins: ANGLE_METROLOGY_PINS[1] || [],
    },
    {
      label: "PALLU CASCADE",
      subLabel: "180° · Grand Brocade End Panel",
      angleDegrees: 180,
      image: saree.images.palluSpread || saree.images.hero,
      pins: ANGLE_METROLOGY_PINS[2] || [],
    },
    {
      label: "PLEAT ARCHITECTURE",
      subLabel: "270° · Accordion Patli Alignment",
      angleDegrees: 270,
      image: saree.images.drape || saree.images.modelDrape || saree.images.hero,
      pins: ANGLE_METROLOGY_PINS[3] || [],
    },
  ];

  const drapeAngles = [
    { label: "01 · FRONT SILHOUETTE", image: saree.images.modelDrape || saree.images.drape },
    { label: "02 · PALLU CASCADE", image: saree.images.palluSpread || saree.images.hero },
    { label: "03 · PLEAT ARCHITECTURE", image: saree.images.drape || saree.images.modelDrape },
    { label: "04 · ARTISAN CLOSE-UP", image: saree.images.detail || saree.images.macro },
  ];

  // Modals state
  const [isSilkMarkOpen, setIsSilkMarkOpen] = useState(false);
  const [isSwatchOpen, setIsSwatchOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState(saree.reviews);

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
        {/* LEFT COLUMN: Sticky Haute Couture Drape / 3D WebGL Stage */}
        <div className="lg:col-span-7 lg:sticky lg:top-28 space-y-3">
          {/* Haute Atelier Mode Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border/80 pb-2.5">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-text-tertiary uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-zari animate-pulse"></span>
              <span className="text-text-primary font-medium">ATELIER DRAPE METROLOGY</span>
            </div>

            <div className="flex items-center gap-1 bg-canvas-elevated p-1 border border-surface-border rounded-xs shadow-xs">
              <button
                onClick={() => setActiveView("360")}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-all rounded-xs flex items-center gap-1.5 ${
                  activeView === "360"
                    ? "bg-text-primary text-canvas-base font-bold shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>360° DRAPE</span>
              </button>
              <button
                onClick={() => setActiveView("ritual")}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-all rounded-xs flex items-center gap-1.5 ${
                  activeView === "ritual"
                    ? "bg-text-primary text-canvas-base font-bold shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>6-YARD RITUAL</span>
              </button>
              <button
                onClick={() => setActiveView("tactile")}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-all rounded-xs flex items-center gap-1.5 ${
                  activeView === "tactile"
                    ? "bg-text-primary text-canvas-base font-bold shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>TACTILE WEAVE LAB</span>
              </button>
            </div>
          </div>

          <div className="relative aspect-[3/4] w-full bg-canvas-elevated border border-surface-border overflow-hidden rounded-xs shadow-xl">
            {activeView === "360" && (
              <RotationalDrape360 frames={drapeFrames} title={saree.title} />
            )}
            {activeView === "ritual" && (
              <SixYardRitualStepper saree={saree} />
            )}
            {activeView === "tactile" && (
              <TextileCanvas
                colorway={selectedColorway}
                fallbackImage={saree.images.hero}
                modelImage={saree.images.modelDrape || saree.images.drape}
                palluImage={saree.images.palluSpread || saree.images.hero}
                title={saree.title}
              />
            )}

            {/* 4K Video Trigger Pill */}
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="absolute bottom-12 left-4 bg-text-primary/90 hover:bg-accent-zari text-canvas-base hover:text-text-primary px-3.5 py-2 rounded-xs border border-surface-border backdrop-blur-md text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 transition-all shadow-lg z-20"
            >
              <Video className="w-3.5 h-3.5" />
              <span>WATCH 4K DRAPE WALKTHROUGH</span>
            </button>
          </div>

          {/* Under-Viewport Precision Controls Bar */}
          {activeView === "tactile" ? (
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

              <div className="text-[10px] font-mono text-accent-zari uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-zari"></span>
                <span>VERLET PHYSICS ENGINE ACTIVE</span>
              </div>
            </div>
          ) : activeView === "ritual" ? (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-canvas-elevated border border-surface-border text-[10px] font-mono text-text-secondary uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-zari animate-pulse"></span>
                <span className="text-text-primary font-medium">6-PHASE ANATOMICAL DRAPING RITUAL</span>
              </div>
              <span className="text-text-tertiary">MASTER WEAVER LINEAGE SPECIFICATION</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-canvas-elevated border border-surface-border">
              <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase">
                CARDINAL DRAPE ANGLES:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {drapeFrames.map((frame, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveAngleIndex(idx);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-mono tracking-wider transition-all border ${
                      activeAngleIndex === idx
                        ? "bg-accent-zari text-canvas-base border-accent-zari font-medium shadow-sm"
                        : "bg-canvas-base text-text-secondary border-surface-border hover:text-text-primary"
                    }`}
                  >
                    {frame.angleDegrees}° · {frame.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
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
              <div className="space-y-0.5">
                <h3 className="text-xs font-mono tracking-widest uppercase text-text-primary">
                  Verified Connoisseur Reviews ({reviewsList.length})
                </h3>
                <div className="flex items-center gap-1 text-accent-zari">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-accent-zari" />
                  ))}
                  <span className="text-[10px] font-mono text-text-tertiary ml-1.5">
                    (5.0 / 5.0)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-3 py-1.5 border border-surface-border hover:border-text-primary text-[11px] font-mono uppercase tracking-wider text-text-primary flex items-center gap-1.5 transition-colors rounded-xs"
              >
                <PenLine className="w-3 h-3 text-accent-zari" />
                <span>Write a Review</span>
              </button>
            </div>

            <div className="space-y-4">
              {reviewsList.map((rev) => (
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

      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        saree={saree}
        onSubmitReview={(newReview) => setReviewsList([newReview, ...reviewsList])}
      />

      {/* Floating Concierge */}
      <WhatsAppConcierge saree={saree} />
    </div>
  );
};

