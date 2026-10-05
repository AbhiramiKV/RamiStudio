import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-canvas-base px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-surface-border border-t-accent-zari animate-spin" />
          <span className="absolute font-serif text-sm italic text-accent-zari select-none">
            R
          </span>
        </div>
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-secondary">
          Opening Heirloom Archive...
        </span>
      </div>
    </div>
  );
}
