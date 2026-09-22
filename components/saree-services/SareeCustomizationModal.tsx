"use client";

import React, { useState, useEffect } from "react";
import {
  SareeProduct,
  SareeCustomizations,
  FallPicoType,
  BlouseNeckline,
  BlouseSleeve,
  BlouseBack,
  BlouseLining,
} from "@/lib/types";
import { useCartStore } from "@/lib/stores/cartStore";
import {
  X,
  Scissors,
  Check,
  ChevronRight,
} from "lucide-react";

type StandardSize = "XS (32)" | "S (34)" | "M (36)" | "L (38)" | "XL (40)" | "XXL (42)" | "Custom";

interface SareeCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  saree: SareeProduct;
  initialCustomizations?: SareeCustomizations;
  onSave: (customizations: SareeCustomizations) => void;
}

export const SareeCustomizationModal: React.FC<SareeCustomizationModalProps> = ({
  isOpen,
  onClose,
  saree,
  initialCustomizations,
  onSave,
}) => {
  const { formatPrice } = useCartStore();

  const [fallPico, setFallPico] = useState<FallPicoType>(
    initialCustomizations?.fallPico || "hand-stitched-free"
  );
  const blouseEnabled = initialCustomizations?.blouse.enabled ?? true;
  const [blouseStyleOption, setBlouseStyleOption] = useState<
    "unstitched" | "custom-tailored"
  >(initialCustomizations?.blouse.styleOption || "unstitched");

  const [neckline, setNeckline] = useState<BlouseNeckline>(
    initialCustomizations?.blouse.neckline || "boat-neck"
  );
  const [sleeve, setSleeve] = useState<BlouseSleeve>(
    initialCustomizations?.blouse.sleeve || "elbow-length"
  );
  const [backCut, setBackCut] = useState<BlouseBack>(
    initialCustomizations?.blouse.back || "deep-u-potli"
  );
  const [lining, setLining] = useState<BlouseLining>(
    initialCustomizations?.blouse.lining || "mul-mul-cotton"
  );
  const [standardSize, setStandardSize] = useState<
    "XS (32)" | "S (34)" | "M (36)" | "L (38)" | "XL (40)" | "XXL (42)" | "Custom"
  >(initialCustomizations?.blouse.measurements?.standardSize || "M (36)");

  const [customBust, setCustomBust] = useState<number>(
    initialCustomizations?.blouse.measurements?.bust || 36
  );
  const [customWaist, setCustomWaist] = useState<number>(
    initialCustomizations?.blouse.measurements?.waist || 30
  );

  const [petticoatEnabled, setPetticoatEnabled] = useState(
    initialCustomizations?.petticoat?.enabled || false
  );
  const [petticoatSize, setPetticoatSize] = useState<"S" | "M" | "L" | "XL">(
    initialCustomizations?.petticoat?.waistSize || "M"
  );

  const [tasselsEnabled, setTasselsEnabled] = useState(
    initialCustomizations?.tassels?.enabled || false
  );

  const [prePleatedEnabled, setPrePleatedEnabled] = useState(
    initialCustomizations?.prePleated?.enabled || false
  );
  const [waistInches, setWaistInches] = useState<number>(
    initialCustomizations?.prePleated?.waistInches || 30
  );
  const [heightFeet, setHeightFeet] = useState<string>(
    initialCustomizations?.prePleated?.heightFeet || "5'5\""
  );

  const [activeTab, setActiveTab] = useState<"finishing" | "blouse" | "draping">(
    "finishing"
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const calculateTailoringTotalUSD = () => {
    let total = 0;
    if (blouseEnabled) {
      total += saree.blouseOption.priceUSD;
      if (blouseStyleOption === "custom-tailored") {
        total += 65; // Tailoring surcharge
      }
    }
    if (petticoatEnabled) total += 35;
    if (tasselsEnabled) total += 25;
    if (prePleatedEnabled) total += 35;
    return total;
  };

  const handleApply = () => {
    const customizations: SareeCustomizations = {
      fallPico,
      blouse: {
        enabled: blouseEnabled,
        styleOption: blouseStyleOption,
        neckline: blouseStyleOption === "custom-tailored" ? neckline : undefined,
        sleeve: blouseStyleOption === "custom-tailored" ? sleeve : undefined,
        back: blouseStyleOption === "custom-tailored" ? backCut : undefined,
        lining: blouseStyleOption === "custom-tailored" ? lining : undefined,
        measurements:
          blouseStyleOption === "custom-tailored"
            ? {
                standardSize,
                bust: customBust,
                waist: customWaist,
              }
            : undefined,
        priceUSD:
          (blouseEnabled ? saree.blouseOption.priceUSD : 0) +
          (blouseStyleOption === "custom-tailored" ? 65 : 0),
      },
      petticoat: petticoatEnabled
        ? {
            enabled: true,
            type: "satin-shaper",
            waistSize: petticoatSize,
            priceUSD: 35,
          }
        : undefined,
      tassels: tasselsEnabled
        ? {
            enabled: true,
            type: "hand-knotted-silk",
            priceUSD: 25,
          }
        : undefined,
      prePleated: prePleatedEnabled
        ? {
            enabled: true,
            waistInches,
            heightFeet,
            priceUSD: 35,
          }
        : undefined,
    };

    onSave(customizations);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-text-primary/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-3xl bg-canvas-base border border-surface-border rounded-xs shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customization-title"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-surface-border flex items-center justify-between bg-canvas-elevated">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-zari/15 border border-accent-zari/40 flex items-center justify-center text-accent-zari-hover">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block">
                Atelier Finishing & Bespoke Tailoring
              </span>
              <h3 id="customization-title" className="font-serif text-2xl text-text-primary">
                Saree Finishing Suite
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

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 border-b border-surface-border bg-canvas-base text-xs font-mono uppercase tracking-widest text-center">
          <button
            onClick={() => setActiveTab("finishing")}
            className={`py-3 px-4 transition-colors border-r border-surface-border ${
              activeTab === "finishing"
                ? "bg-canvas-elevated font-medium text-text-primary border-b-2 border-b-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            1. Fall & Edging
          </button>
          <button
            onClick={() => setActiveTab("blouse")}
            className={`py-3 px-4 transition-colors border-r border-surface-border ${
              activeTab === "blouse"
                ? "bg-canvas-elevated font-medium text-text-primary border-b-2 border-b-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            2. Custom Blouse
          </button>
          <button
            onClick={() => setActiveTab("draping")}
            className={`py-3 px-4 transition-colors ${
              activeTab === "draping"
                ? "bg-canvas-elevated font-medium text-text-primary border-b-2 border-b-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            3. Shaper & Tassels
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* TAB 1: FALL & EDGING */}
          {activeTab === "finishing" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="font-serif text-xl text-text-primary">
                  Complimentary Hand-Stitched Fall & Pico
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed font-light">
                  A traditional 6-yard saree requires a soft cotton fall stitched along the inner lower hem to weigh down the pleats gracefully and prevent fabric fraying.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "hand-stitched-free",
                    title: "Complimentary Fall & Pico",
                    desc: "Hand-stitched color-matched 100% cotton mul-mul fall with micro-pico edge finishing.",
                    badge: "INCLUDED FREE",
                  },
                  {
                    id: "silk-rolled",
                    title: "Pure Silk-Rolled Hem",
                    desc: "Haute couture hand-rolled edge with dyed silk thread. Perfect for organzas and tissues.",
                    badge: "+$15 / ₹1,250",
                  },
                  {
                    id: "unaltered",
                    title: "Send Unaltered Loom Cut",
                    desc: "Saree delivered straight from the loom without finishing for your independent bespoke tailor.",
                    badge: "AS WEAVED",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFallPico(opt.id as FallPicoType)}
                    className={`p-4 border text-left rounded-xs transition-all flex flex-col justify-between space-y-3 ${
                      fallPico === opt.id
                        ? "border-text-primary bg-canvas-elevated shadow-xs"
                        : "border-surface-border bg-canvas-base hover:border-text-secondary"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono tracking-widest text-accent-zari-hover uppercase block">
                        {opt.badge}
                      </span>
                      <div className="font-serif text-base text-text-primary">
                        {opt.title}
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed font-light">
                        {opt.desc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-text-tertiary">Select</span>
                      {fallPico === opt.id && (
                        <Check className="w-4 h-4 text-text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Pre-Pleated Ready to Wear Toggle */}
              <div className="p-5 bg-canvas-elevated border border-surface-border space-y-4 rounded-xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-accent-zari-hover uppercase block">
                      DIASPORA & BUSY CONNOISSEURS
                    </span>
                    <h4 className="font-serif text-lg text-text-primary">
                      Pre-Pleated Ready-to-Wear Drape Service
                    </h4>
                    <p className="text-xs text-text-secondary max-w-lg leading-relaxed font-light">
                      We mathematically press and stitch the front pleats with discreet inside hooks tailored to your exact waist. Slip on the saree in 45 seconds without pins.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-medium text-text-primary block">
                      +{formatPrice(35)}
                    </span>
                    <button
                      onClick={() => setPrePleatedEnabled(!prePleatedEnabled)}
                      className={`mt-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-xs border transition-colors ${
                        prePleatedEnabled
                          ? "bg-text-primary text-canvas-base border-text-primary"
                          : "bg-canvas-base text-text-secondary border-surface-border hover:border-text-primary"
                      }`}
                    >
                      {prePleatedEnabled ? "ENABLED" : "+ ADD"}
                    </button>
                  </div>
                </div>

                {prePleatedEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-surface-border text-xs font-mono animate-fadeIn">
                    <div>
                      <label className="block text-text-secondary uppercase mb-1">
                        Waist Measurement (Inches):
                      </label>
                      <input
                        type="number"
                        min={24}
                        max={48}
                        value={waistInches}
                        onChange={(e) => setWaistInches(Number(e.target.value))}
                        className="w-full bg-canvas-base border border-surface-border p-2 text-text-primary focus:outline-none focus:border-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary uppercase mb-1">
                        Wearer Height with Heels:
                      </label>
                      <select
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        className="w-full bg-canvas-base border border-surface-border p-2 text-text-primary focus:outline-none focus:border-text-primary"
                      >
                        {["5'0\"", "5'2\"", "5'4\"", "5'5\"", "5'6\"", "5'8\"", "5'10\"", "6'0\""].map(
                          (h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM BLOUSE */}
          {activeTab === "blouse" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-start justify-between border-b border-surface-border pb-4">
                <div className="space-y-1">
                  <h4 className="font-serif text-xl text-text-primary">
                    {saree.blouseOption.title}
                  </h4>
                  <p className="text-xs text-text-secondary font-light">
                    {saree.blouseOption.fabric}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBlouseStyleOption("unstitched")}
                    className={`px-3 py-2 text-xs font-mono uppercase tracking-wider border rounded-xs ${
                      blouseStyleOption === "unstitched"
                        ? "bg-text-primary text-canvas-base border-text-primary"
                        : "bg-canvas-base text-text-secondary border-surface-border"
                    }`}
                  >
                    Unstitched Fabric
                  </button>
                  <button
                    onClick={() => setBlouseStyleOption("custom-tailored")}
                    className={`px-3 py-2 text-xs font-mono uppercase tracking-wider border rounded-xs ${
                      blouseStyleOption === "custom-tailored"
                        ? "bg-text-primary text-canvas-base border-text-primary"
                        : "bg-canvas-base text-text-secondary border-surface-border"
                    }`}
                  >
                    Bespoke Tailored (+{formatPrice(65)})
                  </button>
                </div>
              </div>

              {blouseStyleOption === "unstitched" ? (
                <div className="p-5 bg-canvas-elevated border border-surface-border rounded-xs text-xs font-mono space-y-2">
                  <span className="text-text-primary font-medium block">
                    Unstitched Luxury Blouse Length (1.0 Meter)
                  </span>
                  <p className="text-text-secondary font-light leading-relaxed">
                    Delivered with generous 1.0m length allowing full customization by your local bridal couturier, including elbow-length sleeves with matching border selvedge.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 animate-fadeIn">
                  {/* Neckline Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block">
                      1. Front Neckline Architecture:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                      {[
                        { id: "boat-neck", label: "Boat Neck" },
                        { id: "sweetheart", label: "Sweetheart" },
                        { id: "deep-round", label: "Deep Round" },
                        { id: "square", label: "Royal Square" },
                        { id: "high-collar", label: "Mandarin Collar" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setNeckline(item.id as BlouseNeckline)}
                          className={`p-2.5 border text-center rounded-xs transition-colors ${
                            neckline === item.id
                              ? "bg-text-primary text-canvas-base border-text-primary"
                              : "bg-canvas-base border-surface-border text-text-secondary hover:border-text-primary"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sleeve Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block">
                      2. Sleeve Length:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      {[
                        { id: "elbow-length", label: "Elbow (11\")" },
                        { id: "sleeveless", label: "Sleeveless" },
                        { id: "cap-sleeve", label: "Cap Sleeve (5\")" },
                        { id: "full-length", label: "Full Length (21\")" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSleeve(item.id as BlouseSleeve)}
                          className={`p-2.5 border text-center rounded-xs transition-colors ${
                            sleeve === item.id
                              ? "bg-text-primary text-canvas-base border-text-primary"
                              : "bg-canvas-base border-surface-border text-text-secondary hover:border-text-primary"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Back Cut Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block">
                      3. Back Silhouette:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      {[
                        { id: "deep-u-potli", label: "Deep U & Potli" },
                        { id: "dori-tie-up", label: "Dori Tie-Up" },
                        { id: "backless-tassels", label: "Backless Tassels" },
                        { id: "classic-hook", label: "Classic Hook" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setBackCut(item.id as BlouseBack)}
                          className={`p-2.5 border text-center rounded-xs transition-colors ${
                            backCut === item.id
                              ? "bg-text-primary text-canvas-base border-text-primary"
                              : "bg-canvas-base border-surface-border text-text-secondary hover:border-text-primary"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lining & Padding */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block">
                      4. Lining & Cups:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                      {[
                        { id: "mul-mul-cotton", label: "100% Breathable Mul-Mul" },
                        { id: "pure-silk", label: "Pure Silk Lining (+Included)" },
                        { id: "padded-cups", label: "Removable Padded Cups" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setLining(item.id as BlouseLining)}
                          className={`p-2.5 border text-center rounded-xs transition-colors ${
                            lining === item.id
                              ? "bg-text-primary text-canvas-base border-text-primary"
                              : "bg-canvas-base border-surface-border text-text-secondary hover:border-text-primary"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizing inputs */}
                  <div className="p-4 bg-canvas-elevated border border-surface-border space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-text-primary font-medium">
                        Standard Size or Custom Inches
                      </span>
                      <span className="text-[10px] text-text-tertiary">
                        Our master cutter reviews every order
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                      {(["XS (32)", "S (34)", "M (36)", "L (38)", "XL (40)", "XXL (42)", "Custom"] as StandardSize[]).map(
                        (sz) => (
                          <button
                            key={sz}
                            onClick={() => setStandardSize(sz)}
                            className={`px-3 py-1.5 border rounded-xs ${
                              standardSize === sz
                                ? "bg-text-primary text-canvas-base border-text-primary"
                                : "bg-canvas-base border-surface-border text-text-secondary"
                            }`}
                          >
                            {sz}
                          </button>
                        )
                      )}
                    </div>

                    {standardSize === "Custom" && (
                      <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                        <div>
                          <label className="text-text-tertiary block mb-1">
                            Bust (Inches):
                          </label>
                          <input
                            type="number"
                            value={customBust}
                            onChange={(e) => setCustomBust(Number(e.target.value))}
                            className="w-full bg-canvas-base border border-surface-border p-2"
                          />
                        </div>
                        <div>
                          <label className="text-text-tertiary block mb-1">
                            Under-Bust / Waist (Inches):
                          </label>
                          <input
                            type="number"
                            value={customWaist}
                            onChange={(e) => setCustomWaist(Number(e.target.value))}
                            className="w-full bg-canvas-base border border-surface-border p-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHAPER & TASSELS */}
          {activeTab === "draping" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Silhouette Mermaid Shaper */}
              <div className="p-5 bg-canvas-elevated border border-surface-border space-y-3 rounded-xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-accent-zari-hover uppercase block">
                      UNDERGARMENT ARCHITECTURE
                    </span>
                    <h4 className="font-serif text-lg text-text-primary">
                      Color-Matched Mermaid Silhouette Shaper
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed font-light">
                      A smooth, microfiber satin petticoat engineered with side-slit flexibility and drawstring waist to sculpt seamless pleats without bulky traditional cotton bulk.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-medium text-text-primary block">
                      +{formatPrice(35)}
                    </span>
                    <button
                      onClick={() => setPetticoatEnabled(!petticoatEnabled)}
                      className={`mt-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-xs border transition-colors ${
                        petticoatEnabled
                          ? "bg-text-primary text-canvas-base border-text-primary"
                          : "bg-canvas-base text-text-secondary border-surface-border hover:border-text-primary"
                      }`}
                    >
                      {petticoatEnabled ? "INCLUDED" : "+ ADD"}
                    </button>
                  </div>
                </div>

                {petticoatEnabled && (
                  <div className="pt-3 border-t border-surface-border flex items-center gap-3 text-xs font-mono animate-fadeIn">
                    <span className="text-text-tertiary">Select Waist Size:</span>
                    {(["S", "M", "L", "XL"] as ("S" | "M" | "L" | "XL")[]).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setPetticoatSize(sz)}
                        className={`w-8 h-8 border rounded-xs ${
                          petticoatSize === sz
                            ? "bg-text-primary text-canvas-base border-text-primary"
                            : "bg-canvas-base border-surface-border text-text-secondary"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hand-Knotted Pallu Tassels (Kuchu) */}
              <div className="p-5 bg-canvas-elevated border border-surface-border space-y-3 rounded-xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-accent-zari-hover uppercase block">
                      HERITAGE ORNAMENTATION
                    </span>
                    <h4 className="font-serif text-lg text-text-primary">
                      Hand-Knotted Silk Pallu Tassels (Kuchu)
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed font-light">
                      Individual pure silk fringe threads knotted by hand with miniature antique brass beads along the raw edge of the pallu.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-medium text-text-primary block">
                      +{formatPrice(25)}
                    </span>
                    <button
                      onClick={() => setTasselsEnabled(!tasselsEnabled)}
                      className={`mt-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-xs border transition-colors ${
                        tasselsEnabled
                          ? "bg-text-primary text-canvas-base border-text-primary"
                          : "bg-canvas-base text-text-secondary border-surface-border hover:border-text-primary"
                      }`}
                    >
                      {tasselsEnabled ? "INCLUDED" : "+ ADD"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-surface-border bg-canvas-elevated flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-text-secondary">
            <span>Finishing & Services Subtotal: </span>
            <span className="text-text-primary font-medium">
              +{formatPrice(calculateTailoringTotalUSD())}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 border border-surface-border text-xs font-mono uppercase tracking-widest hover:border-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 sm:flex-initial px-8 py-2.5 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>SAVE & APPLY TO BAG</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
