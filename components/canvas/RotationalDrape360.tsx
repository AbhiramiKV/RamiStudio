"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, MoveHorizontal, Compass } from "lucide-react";

export interface MetrologyPin {
  id: number;
  top: string;
  left: string;
  label: string;
  badge: string;
  title: string;
  desc: string;
  metric: string;
}

interface RotationalDrape360Props {
  frames: {
    label: string;
    subLabel: string;
    angleDegrees: number;
    image: string;
    pins: MetrologyPin[];
  }[];
  title: string;
  className?: string;
}

export const RotationalDrape360: React.FC<RotationalDrape360Props> = ({
  frames,
  title,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activePinId, setActivePinId] = useState<number | null>(frames[0]?.pins[0]?.id ?? null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const accumulatedDeltaXRef = useRef<number>(0);
  const velXRef = useRef<number>(0);

  const numFrames = frames.length;
  const currentFrame = frames[currentIndex] || frames[0];

  useEffect(() => {
    if (currentFrame?.pins?.length) {
      setActivePinId(currentFrame.pins[0].id);
    } else {
      setActivePinId(null);
    }
  }, [currentIndex, currentFrame]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isZoomed) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    accumulatedDeltaXRef.current = 0;
    velXRef.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isZoomed && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setLoupePos({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
      return;
    }

    if (!isDragging) return;

    const dx = e.clientX - startXRef.current;
    accumulatedDeltaXRef.current += dx;
    velXRef.current = dx;
    startXRef.current = e.clientX;

    const stepThreshold = 45;
    if (Math.abs(accumulatedDeltaXRef.current) >= stepThreshold) {
      const steps = Math.floor(Math.abs(accumulatedDeltaXRef.current) / stepThreshold);
      const dir = accumulatedDeltaXRef.current > 0 ? -1 : 1;
      accumulatedDeltaXRef.current %= stepThreshold;

      setCurrentIndex((prev) => {
        let next = (prev + dir * steps) % numFrames;
        if (next < 0) next += numFrames;
        return next;
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (Math.abs(velXRef.current) > 12) {
      const dir = velXRef.current > 0 ? -1 : 1;
      setCurrentIndex((prev) => {
        let next = (prev + dir) % numFrames;
        if (next < 0) next += numFrames;
        return next;
      });
    }
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => {
      const next = !prev;
      setZoomLevel(next ? 2.5 : 1);
      return next;
    });
  };

  const handleStepPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + numFrames) % numFrames);
  };

  const handleStepNext = () => {
    setCurrentIndex((prev) => (prev + 1) % numFrames);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-full min-h-[520px] md:min-h-[660px] bg-canvas-base border border-surface-border select-none overflow-hidden touch-none group ${
        isZoomed
          ? "cursor-zoom-out"
          : isDragging
          ? "cursor-ew-resize"
          : "cursor-grab"
      } ${className}`}
      data-cursor={isZoomed ? "ZOOM OUT" : isDragging ? "SCRUBBING 360°" : "DRAG TO ROTATE"}
    >
      {/* Background Ambience Subtle Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-canvas-base/10 to-canvas-base/40 pointer-events-none z-10" />

      {/* Primary High-Resolution Photographic Display */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: isZoomed ? `scale(${zoomLevel})` : "scale(1)",
          transformOrigin: `${loupePos.x}% ${loupePos.y}%`,
        }}
      >
        <Image
          src={currentFrame.image}
          alt={`${title} - ${currentFrame.label}`}
          fill
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover transition-opacity duration-300"
          priority
          draggable={false}
        />

        {/* Dynamic Metrology Pins */}
        {!isZoomed && currentFrame.pins.map((pin) => {
          const isSelected = activePinId === pin.id;
          return (
            <button
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation();
                setActivePinId(isSelected ? null : pin.id);
              }}
              style={{ top: pin.top, left: pin.left }}
              className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 group/pin flex items-center gap-1.5 focus:outline-none z-20"
              title={pin.title}
            >
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-zari opacity-50" />
                <span
                  className={`relative inline-flex rounded-full h-4 w-4 border-2 border-canvas-base shadow-lg transition-transform group-hover/pin:scale-125 ${
                    isSelected
                      ? "bg-accent-zari-hover scale-125 ring-2 ring-accent-zari"
                      : "bg-accent-zari"
                  }`}
                />
              </span>
              <span className="px-2 py-0.5 bg-canvas-base/95 backdrop-blur-md border border-surface-border text-[9px] font-mono tracking-wider text-text-primary uppercase shadow-md opacity-90 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">
                {pin.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Pin Metrology HUD Overlay */}
      {!isZoomed && activePinId !== null && (
        <div className="absolute bottom-16 left-4 right-4 sm:left-6 sm:right-6 bg-canvas-base/95 backdrop-blur-md border border-accent-zari/50 p-4 rounded-xs shadow-2xl z-20 pointer-events-auto animate-in fade-in duration-300">
          {(() => {
            const pin = currentFrame.pins.find((p) => p.id === activePinId);
            if (!pin) return null;
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-accent-zari/15 border border-accent-zari/40 text-accent-zari text-[9px] font-mono tracking-widest uppercase">
                    {pin.badge}
                  </span>
                  <button
                    onClick={() => setActivePinId(null)}
                    className="text-text-tertiary hover:text-text-primary text-[10px] font-mono px-1.5 py-0.5"
                  >
                    ✕ CLOSE
                  </button>
                </div>
                <h4 className="font-serif text-sm font-medium text-text-primary">{pin.title}</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed font-light">{pin.desc}</p>
                <div className="pt-2 border-t border-surface-border/60 text-[10px] font-mono text-accent-zari-hover font-medium">
                  METRIC: {pin.metric}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Top Left Angle Heading & Compass Indicator */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
        <div className="flex items-center gap-2 bg-canvas-base/90 backdrop-blur-md px-3 py-1.5 border border-surface-border text-[10px] font-mono tracking-widest text-text-primary uppercase shadow-sm">
          <Compass className="w-3.5 h-3.5 text-accent-zari" />
          <span>{currentFrame.angleDegrees}° · {currentFrame.label}</span>
        </div>
        <span className="hidden sm:inline bg-canvas-base/80 backdrop-blur-md px-2.5 py-1.5 border border-surface-border text-[9px] font-mono tracking-wider text-text-tertiary uppercase">
          {currentFrame.subLabel}
        </span>
      </div>

      {/* Top Right Zoom Toggle Button */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleZoom}
          className="bg-canvas-base/90 hover:bg-canvas-base backdrop-blur-md px-3 py-1.5 border border-surface-border text-[10px] font-mono tracking-widest text-text-primary uppercase flex items-center gap-1.5 transition-colors shadow-sm"
          title={isZoomed ? "Exit 4X Loupe" : "Inspect Fabric 4X"}
        >
          {isZoomed ? <ZoomOut className="w-3.5 h-3.5 text-accent-zari" /> : <ZoomIn className="w-3.5 h-3.5 text-accent-zari" />}
          <span>{isZoomed ? "1X RESET" : "4X LOUPE"}</span>
        </button>
      </div>

      {/* Bottom Rotation Dial & Scrub Guide */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Drag Instruction */}
        <div className="flex items-center gap-2 bg-canvas-base/90 backdrop-blur-md px-3 py-1.5 border border-surface-border text-[9px] sm:text-[10px] font-mono tracking-widest text-text-secondary uppercase shadow-sm">
          <MoveHorizontal className="w-3.5 h-3.5 text-accent-zari animate-pulse flex-shrink-0" />
          <span>DRAG 360° TO ROTATE TURNTABLE</span>
        </div>

        {/* Step Buttons & Angle Pips */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-canvas-base/90 backdrop-blur-md p-1 border border-surface-border shadow-sm">
          <button
            onClick={handleStepPrev}
            className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-text-primary text-xs font-mono transition-colors"
            title="Previous Angle"
          >
            ←
          </button>

          <div className="flex items-center gap-1 px-1">
            {frames.map((frame, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 transition-all rounded-full ${
                  currentIndex === idx
                    ? "w-5 bg-accent-zari"
                    : "w-2 bg-surface-border hover:bg-text-tertiary"
                }`}
                title={frame.label}
              />
            ))}
          </div>

          <button
            onClick={handleStepNext}
            className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-text-primary text-xs font-mono transition-colors"
            title="Next Angle"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};
