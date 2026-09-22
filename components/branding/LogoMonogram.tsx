import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  monochrome?: boolean;
}

export const LogoMonogram: React.FC<LogoProps> = ({
  size = 48,
  monochrome = false,
  className = "",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      aria-label="Rami Studio Monogram (R & S)"
      className={`group transition-transform duration-500 hover:scale-[1.03] ${className}`}
      {...props}
    >
      <defs>
        {/* Antique Matte Zari Electro-Lacquered Gradient */}
        <linearGradient id="ramiZariGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8B568" />
          <stop offset="45%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#B28C45" />
        </linearGradient>
      </defs>

      {/* Delicate Handloom Warp Tension Guide */}
      <line
        x1="26"
        y1="14"
        x2="26"
        y2="106"
        stroke={monochrome ? "currentColor" : "url(#ramiZariGrad)"}
        strokeWidth="0.7"
        strokeDasharray="2 3"
        opacity="0.35"
      />

      {/* Classical Architectural 'R' Stem with Roman Bracketed Serifs */}
      <path
        d="M 27 20 H 43 M 35 20 V 100 M 25 100 H 45"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sculpted 'R' Architectural Upper Bowl */}
      <path
        d="M 35 24 C 54 24 72 25 78 37 C 82 44 80 54 73 60 C 64 64 48 64 35 64"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 'R' Saree Drape Leg: Outward Pallu Kick with Haute Couture Tailoring */}
      <path
        d="M 52 64 C 61 74 71 86 82 96 C 86 100 92 101 98 100"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Intertwined Fluid 'S' Silk Ribbon in Antique Matte Zari */}
      {/* Top Arc of 'S' - Sweeps gently across the crown of 'R' */}
      <path
        d="M 88 28 C 86 19 72 16 60 20 C 48 24 46 36 56 46 C 68 56 86 64 84 80 C 82 94 68 101 52 98 C 42 96 38 88 40 82"
        stroke={monochrome ? "currentColor" : "url(#ramiZariGrad)"}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Woven Thread Crossover: Subtle break illusion over the 'R' leg */}
      <path
        d="M 64 68 C 72 73 78 78 80 84"
        stroke={monochrome ? "currentColor" : "url(#ramiZariGrad)"}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Haute Joaillerie Loom Accents (Jewelry-grade golden beads) */}
      <circle
        cx="88"
        cy="28"
        r="2"
        fill={monochrome ? "currentColor" : "url(#ramiZariGrad)"}
      />
      <circle
        cx="52"
        cy="64"
        r="2.2"
        fill={monochrome ? "currentColor" : "url(#ramiZariGrad)"}
      />
      <circle
        cx="40"
        cy="82"
        r="1.8"
        fill={monochrome ? "currentColor" : "url(#ramiZariGrad)"}
      />
    </svg>
  );
};
