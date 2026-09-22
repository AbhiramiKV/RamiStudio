"use client";

import React, { useEffect, useRef, useState } from "react";

export const MagneticCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check for hover elements with data-cursor
      const target = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
      if (target) {
        const text = target.getAttribute("data-cursor") || "";
        setCursorText(text);
        setIsActive(true);
      } else {
        const clickable = (e.target as HTMLElement)?.closest("button, a, input, select");
        if (clickable) {
          setCursorText("");
          setIsActive(true);
        } else {
          setCursorText("");
          setIsActive(false);
        }
      }
    };

    let animationFrameId: number;

    const renderLoop = () => {
      // Smooth interpolation for the outer ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Precision Center Pin */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-text-primary z-[9999] transition-opacity duration-200"
        style={{ willChange: "transform" }}
      />

      {/* Fluid Contextual Ring */}
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9998] flex items-center justify-center rounded-full transition-all duration-300 ease-silk-out -ml-6 -mt-6 ${
          cursorText
            ? "w-24 h-24 bg-text-primary text-canvas-base -ml-12 -mt-12 shadow-2xl"
            : isActive
            ? "w-12 h-12 border border-accent-zari bg-accent-zari/15 backdrop-blur-[2px]"
            : "w-8 h-8 border border-text-primary/30"
        }`}
        style={{ willChange: "transform" }}
      >
        {cursorText && (
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-medium text-center px-1 animate-fadeIn">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};
