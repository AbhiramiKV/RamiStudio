"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface Fallback360ViewerProps {
  imageSrc: string;
  title: string;
}

export const Fallback360Viewer: React.FC<Fallback360ViewerProps> = ({
  imageSrc,
  title,
}) => {
  const [rotationIndex, setRotationIndex] = useState(0);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 12) {
      setRotationIndex((prev) => (prev + (delta > 0 ? 1 : -1) + 36) % 36);
      startXRef.current = e.clientX;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      className="relative w-full h-full min-h-[480px] bg-canvas-elevated flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-cursor="ROTATE 360°"
    >
      <div className="relative w-full h-full max-w-lg aspect-[3/4]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition-transform duration-75"
          style={{
            transform: `rotateY(${rotationIndex * 10}deg) scale(0.95)`,
          }}
          priority
        />
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[11px] font-mono tracking-widest text-text-secondary bg-canvas-base/80 backdrop-blur-md px-4 py-2 rounded-full border border-surface-border">
        <span>360° TACTILE VIEW</span>
        <span>DRAG TO ROTATE</span>
        <span>36 FRAMES</span>
      </div>
    </div>
  );
};
