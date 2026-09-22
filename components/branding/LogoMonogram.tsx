import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  monochrome?: boolean;
  variant?: "solid" | "duotone" | "outline";
}

export const LogoMonogram: React.FC<LogoProps> = ({
  size = 48,
  monochrome = false,
  variant = "duotone",
  className = "",
  ...props
}) => {
  const isMonochrome = monochrome || variant === "solid";
  const uid = "rami-mono";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-label="Rami Studio"
      className={`transition-all duration-500 hover:scale-[1.04] shrink-0 select-none ${className}`}
      {...props}
    >
      <defs>
        {/* Antique matte zari — warm champagne gold */}
        <linearGradient id={`${uid}-zari`} x1="10%" y1="10%" x2="90%" y2="92%">
          <stop offset="0%" stopColor="#E8CC88" />
          <stop offset="40%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#9A7535" />
        </linearGradient>

        {/* Deep obsidian ink for the R stroke */}
        <linearGradient id={`${uid}-ink`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A2A26" />
          <stop offset="100%" stopColor="#111110" />
        </linearGradient>

        {/* Soft glow filter for the S ribbon */}
        <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Hairline cartouche — barely-there luxury frame ── */}
      <rect
        x="5" y="5" width="90" height="90" rx="1.5"
        stroke={isMonochrome ? "currentColor" : `url(#${uid}-zari)`}
        strokeWidth="0.6"
        strokeOpacity="0.28"
        fill="none"
      />

      {/* ── THE R ── */}
      {/* Vertical stem */}
      <path
        d="M 20 18 L 26 18 L 26 82 L 20 82 Z"
        fill={isMonochrome ? "currentColor" : `url(#${uid}-ink)`}
      />
      {/* Top bracket serif */}
      <path
        d="M 16 18 L 30 18 L 30 21.5 L 16 21.5 Z"
        fill={isMonochrome ? "currentColor" : `url(#${uid}-ink)`}
      />
      {/* Bottom bracket serif */}
      <path
        d="M 16 78.5 L 30 78.5 L 30 82 L 16 82 Z"
        fill={isMonochrome ? "currentColor" : `url(#${uid}-ink)`}
      />
      {/* Upper bowl */}
      <path
        d="M 26 18 L 58 18 C 77 18 84 27 84 37 C 84 47 77 56 58 56 L 26 56 L 26 50 L 56 50 C 69 50 76 44.5 76 37 C 76 29.5 69 24 56 24 L 26 24 Z"
        fill={isMonochrome ? "currentColor" : `url(#${uid}-ink)`}
      />
      {/* Diagonal leg */}
      <path
        d="M 44 54 C 52 54 60 60 67 70 L 79 84 L 73 84 L 61 69 C 55 61 47 57 40 57 Z"
        fill={isMonochrome ? "currentColor" : `url(#${uid}-ink)`}
      />

      {/* ── THE S — fluid antique zari ribbon ── */}
      <g filter={isMonochrome ? undefined : `url(#${uid}-glow)`}>
        <path
          d="M 80 28 C 77 19 67 14 55 16 C 44 17.5 39 24 41 31 C 43 36 48 40 57 44 L 66 48 C 74 52 79 58 78 66 C 77 74 70 80 60 81 C 51 82 44 78 43 72 L 49 72 C 50 75.5 54 78 61 77 C 68 76 72 71 72 65 C 72 59 67 55 59 51 L 50 47 C 41 43 36 37 37 30 C 38 21 47 12 60 11 C 73 10 83 17 84 28 Z"
          fill={isMonochrome ? "currentColor" : `url(#${uid}-zari)`}
          opacity="0.97"
        />
      </g>

      {/* ── Weft intersection notch — loom-interlace illusion ── */}
      <path
        d="M 57 57 L 64 62 L 62 65 L 55 60 Z"
        fill={isMonochrome ? "white" : "#F9F8F6"}
        opacity="0.88"
      />

      {/* ── Joaillerie pivot diamond — master loom eyelet ── */}
      <path
        d="M 52 49 L 55 53 L 52 57 L 49 53 Z"
        fill={isMonochrome ? "currentColor" : `url(#${uid}-zari)`}
        opacity="0.92"
      />
    </svg>
  );
};
