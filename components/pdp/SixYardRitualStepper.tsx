"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SareeProduct } from "@/lib/types";
import { ChevronRight, ChevronLeft, ShieldCheck, Sparkles, Ruler, Compass } from "lucide-react";

interface SixYardRitualStepperProps {
  saree: SareeProduct;
}

export const SixYardRitualStepper: React.FC<SixYardRitualStepperProps> = ({ saree }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      stepNumber: "01",
      name: "The Foundation",
      subtitle: "Inskirt Cordon & Ground Anchor",
      image: saree.images.drape || saree.images.hero,
      technique: "Tuck first plain corner firmly into petticoat drawstring at right waist; complete one full clockwise floor-level circumambulation.",
      metrology: {
        metric: "Ground Clearance: 1.5cm above floor · 0 drag on raw hem",
        tension: "Tension: 18.5 N/m snug cordon cinch",
        weightDistribution: "Base Load: 28% total garment weight",
        craftSecret: "Hand-stitched mul-mul cotton fall tape protects the bottom selvedge against temple stone abrasion.",
      },
    },
    {
      stepNumber: "02",
      name: "Patli Geometry",
      subtitle: "7 Accordion Knife Pleats",
      image: saree.images.drape || saree.images.hero,
      technique: "Measure fabric between thumb and index finger into 7 uniform accordion pleats, each exactly 14cm (5.5 inches) deep.",
      metrology: {
        metric: "Pleat Depth: 14cm uniform · 7 crisp patli folds",
        tension: "Bias Grain: 90° warp vertical drop",
        weightDistribution: "Central Mass: 42% garment mass concentrated at navel",
        craftSecret: "Pure high-twist mulberry silk retains sharp, razor-crisp crease memory throughout 12+ hours of ceremonial wear.",
      },
    },
    {
      stepNumber: "03",
      name: "The Navel Anchor",
      subtitle: "Waist Cinch & Oddiyanam Lock",
      image: saree.images.drape || saree.images.hero,
      technique: "Align pleat tops flush and tuck directly into the center navel. Cinch firmly with the antique South Indian gold Oddiyanam waist belt.",
      metrology: {
        metric: "Lock Stability: Anti-slip lock rated for active walking",
        tension: "Waist Compression: Gentle anatomical hold",
        weightDistribution: "Waist Anchor: 38% total counterweight",
        craftSecret: "The Oddiyanam belt prevents pleat slippage without requiring awkward modern safety pin piercing.",
      },
    },
    {
      stepNumber: "04",
      name: "The Bias Sweep",
      subtitle: "45° Cross-Bust Uparli Drape",
      image: saree.images.modelDrape || saree.images.hero,
      technique: "Bring remaining yardage around back from right waist, under left armpit, and sweep diagonally across the chest over the tailored choli.",
      metrology: {
        metric: "Angle: Exactly 45° diagonal twill bias alignment",
        tension: "Supple Drape: 14.2 N/m contoured bosom tension",
        weightDistribution: "Torso Relief: Smooth anatomical fit with exposed midriff curve",
        craftSecret: "Dhoop-Chhaon twill cross-weave shifts optically between carbon depth and olive shimmer as light hits the 45° angle.",
      },
    },
    {
      stepNumber: "05",
      name: "Shoulder Brooch",
      subtitle: "Left Clavicle Pin & Weight Balance",
      image: saree.images.modelDrape || saree.images.hero,
      technique: "Pleat the uparli onto the left shoulder seam of the blouse. Anchor securely at the clavicle with an heirloom brooch.",
      metrology: {
        metric: "Pin Position: 3.5cm below clavicle crest on choli seam",
        tension: "Counter-Tension: Perfectly neutralizes trailing pallu drag",
        weightDistribution: "Shoulder Load: 34% total garment mass",
        craftSecret: "Pinning precisely to the blouse seam distributes the weight across the shoulder blade, preventing neck strain.",
      },
    },
    {
      stepNumber: "06",
      name: "Pallu Cascade",
      subtitle: "1.80m Zari Brocade End-Piece",
      image: saree.images.palluSpread || saree.images.hero,
      technique: "Allow the remaining 1.80m grand Korvai brocade panel to cascade unimpeded down the back past the knee.",
      metrology: {
        metric: "Pallu Drop: 1.80m length · Floor clearance 22cm",
        tension: "Gravity: Pure gravitational free fall",
        weightDistribution: "End Mass: Certified 1.8g pure silver electroplated wire",
        craftSecret: "Two weavers tossed shuttles in synchrony across the pit loom so the metallic border meets the silk body without seams.",
      },
    },
  ];

  const current = steps[activeStep];

  return (
    <div className="relative w-full h-full min-h-[520px] md:min-h-[660px] bg-canvas-base border border-surface-border flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Top Header: Step Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-4 z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent-zari animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-text-tertiary">
              The 6-Yard Ritual · Draping Masterclass
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-text-primary tracking-tight">
            Phase {current.stepNumber} · {current.name}
          </h3>
        </div>

        {/* Step Pill Navigation */}
        <div className="flex items-center gap-1 bg-canvas-elevated p-1 border border-surface-border">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wider transition-all ${
                activeStep === idx
                  ? "bg-accent-zari text-canvas-base font-medium shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {s.stepNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Center 50/50 Stage: Editorial Image + Engineering Metrology Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
        {/* Left: High-Res Editorial Detail for this Phase */}
        <div className="md:col-span-5 relative aspect-[4/5] w-full max-w-[380px] mx-auto bg-canvas-elevated border border-surface-border overflow-hidden shadow-md">
          <Image
            src={current.image}
            alt={current.name}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover transition-all duration-500"
            priority
          />
          <div className="absolute top-3 left-3 bg-canvas-base/90 backdrop-blur-md px-2.5 py-1 border border-surface-border text-[9px] font-mono tracking-wider uppercase text-accent-zari">
            {current.subtitle}
          </div>
        </div>

        {/* Right: Architectural Technique & Metrology Cards */}
        <div className="md:col-span-7 space-y-4">
          {/* Technique Instruction */}
          <div className="bg-canvas-elevated/80 border border-surface-border p-4 rounded-xs">
            <span className="text-[9px] font-mono tracking-widest text-text-tertiary uppercase block mb-1">
              Draping Technique & Gesture:
            </span>
            <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-light">
              {current.technique}
            </p>
          </div>

          {/* 3-Point Metrology Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-canvas-base border border-surface-border p-3">
              <span className="text-[9px] font-mono tracking-wider text-accent-zari block mb-0.5">
                GEOMETRIC METRIC:
              </span>
              <span className="text-[11px] font-mono text-text-primary">
                {current.metrology.metric}
              </span>
            </div>

            <div className="bg-canvas-base border border-surface-border p-3">
              <span className="text-[9px] font-mono tracking-wider text-accent-zari block mb-0.5">
                SILK GRAIN TENSION:
              </span>
              <span className="text-[11px] font-mono text-text-primary">
                {current.metrology.tension}
              </span>
            </div>

            <div className="bg-canvas-base border border-surface-border p-3 sm:col-span-2">
              <span className="text-[9px] font-mono tracking-wider text-accent-zari block mb-0.5">
                ANATOMICAL LOAD BALANCE:
              </span>
              <span className="text-[11px] font-mono text-text-primary">
                {current.metrology.weightDistribution}
              </span>
            </div>
          </div>

          {/* Master Weaver Craft Secret */}
          <div className="bg-accent-zari/5 border border-accent-zari/30 p-3 flex items-start gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-accent-zari flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-text-secondary leading-relaxed font-light">
              <strong className="text-text-primary font-medium">Master Weaver Lineage Secret: </strong>
              {current.metrology.craftSecret}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stepper Controls */}
      <div className="flex items-center justify-between border-t border-surface-border pt-4 z-10">
        <button
          onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
          className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase border flex items-center gap-1.5 transition-colors ${
            activeStep === 0
              ? "opacity-30 border-surface-border text-text-tertiary cursor-not-allowed"
              : "border-surface-border text-text-secondary hover:text-text-primary hover:border-text-primary"
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>PREVIOUS PHASE</span>
        </button>

        <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase hidden sm:inline">
          PHASE {activeStep + 1} OF {steps.length}
        </span>

        <button
          onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
          disabled={activeStep === steps.length - 1}
          className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase border flex items-center gap-1.5 transition-colors ${
            activeStep === steps.length - 1
              ? "opacity-30 border-surface-border text-text-tertiary cursor-not-allowed"
              : "border-text-primary bg-text-primary text-canvas-base hover:bg-accent-zari hover:text-text-primary"
          }`}
        >
          <span>NEXT PHASE</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
