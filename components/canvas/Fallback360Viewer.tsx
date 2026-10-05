"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, Layers } from "lucide-react";

interface Fallback360ViewerProps {
  imageSrc?: string;
  title?: string;
}

export const Fallback360Viewer: React.FC<Fallback360ViewerProps> = ({
  imageSrc = "/images/products/saree-1.jpg",
  title = "Handcrafted Heirloom Silk Saree",
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLoupePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      setIsPanning(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || !lastTouchRef.current || zoomLevel <= 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - lastTouchRef.current.x;
    const dy = touch.clientY - lastTouchRef.current.y;

    setPosition((prev) => ({
      x: Math.max(-150, Math.min(150, prev.x + dx)),
      y: Math.max(-150, Math.min(150, prev.y + dy)),
    }));

    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    lastTouchRef.current = null;
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => {
      const next = Math.max(1, Math.min(3.5, prev + delta));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const resetView = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full min-h-[500px] md:min-h-[660px] bg-canvas-elevated flex items-center justify-center select-none overflow-hidden touch-pan-y"
      style={{ touchAction: "pan-y" }}
    >
      {/* High-Resolution Heirloom Portrait */}
      <div
        className="relative w-full h-full max-w-xl aspect-[3/4] flex items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
          transformOrigin: `${loupePos.x}% ${loupePos.y}%`,
        }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-contain"
          priority
        />
      </div>

      {/* Floating Loupe Lens for Desktop Connoisseurs */}
      {isHovered && zoomLevel === 1 && (
        <div
          className="pointer-events-none absolute hidden lg:block w-36 h-36 rounded-full border-2 border-accent-zari/80 shadow-2xl overflow-hidden z-30 backdrop-contrast-125"
          style={{
            left: `${loupePos.x}%`,
            top: `${loupePos.y}%`,
            transform: "translate(-50%, -50%)",
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
            backgroundSize: "400%",
            backgroundRepeat: "no-repeat",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <div className="absolute inset-0 bg-accent-zari/5 pointer-events-none" />
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="text-[8px] font-mono tracking-widest text-text-primary bg-canvas-base/90 px-1.5 py-0.5 rounded-full uppercase border border-surface-border">
              2.5X LOUPE
            </span>
          </div>
        </div>
      )}

      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-canvas-base/90 backdrop-blur-md border border-surface-border rounded-xs shadow-xs text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-accent-zari ml-1.5" />
          <span className="text-[10px] tracking-widest uppercase text-text-secondary px-1">
            Tactile Silk Loupe
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-canvas-base/90 backdrop-blur-md border border-surface-border rounded-xs shadow-xs">
          <button
            onClick={() => handleZoom(0.5)}
            disabled={zoomLevel >= 3.5}
            className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.5)}
            disabled={zoomLevel <= 1}
            className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-text-secondary hover:text-text-primary transition-colors border-l border-surface-border pl-2"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Information Pill */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 pointer-events-none flex items-center justify-between sm:justify-start gap-3 bg-canvas-base/90 backdrop-blur-md px-3.5 py-1.5 border border-surface-border text-[10px] font-mono tracking-widest text-text-secondary uppercase shadow-xs">
        <div className="flex items-center gap-2 truncate">
          <Layers className="w-3 h-3 text-accent-zari flex-shrink-0" />
          <span className="truncate">
            {zoomLevel > 1
              ? `MACRO INSPECTION (${zoomLevel.toFixed(1)}X)`
              : "HOVER FOR HIGH-RES LOUPE · PINCH TO ZOOM"}
          </span>
        </div>
        <span className="text-[9px] text-text-tertiary">SILK MARK VERIFIED</span>
      </div>
    </div>
  );
};
