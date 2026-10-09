import React from "react";
import { LogoMonogram } from "@/components/branding/LogoMonogram";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-canvas-base px-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Circular Loom Shuttle Aura */}
          <div className="absolute inset-0 rounded-full border border-accent-zari/25 border-t-accent-zari animate-spin" />
          {/* Paisley Hallmark Logo Mark */}
          <LogoMonogram
            size={34}
            className="text-accent-zari animate-pulse drop-shadow-[0_0_8px_rgba(201,162,75,0.35)]"
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-primary">
            RAMI STUDIO
          </span>
          <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-text-secondary">
            Opening Heirloom Archive...
          </span>
        </div>
      </div>
    </div>
  );
}
