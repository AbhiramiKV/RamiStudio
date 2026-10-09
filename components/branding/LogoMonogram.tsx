import React, { useId } from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  monochrome?: boolean;
  variant?: "solid" | "duotone" | "outline" | "gold-tile" | "framed";
}

export const LogoMonogram: React.FC<LogoProps> = ({
  size = 48,
  monochrome = false,
  variant = "duotone",
  className = "",
  ...props
}) => {
  const isMonochrome = monochrome || variant === "solid";
  const isTile = variant === "gold-tile";
  const isFramed = variant === "framed";
  const rawId = useId();
  const uid = `rami-paisley-${rawId.replace(/:/g, "")}`;

  // Paisley mark centered in 100x100 viewBox
  const scale = 0.3555;
  const tx = 50 - 257.5 * scale;
  const ty = 50 - 182.5 * scale;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-label="Rami Studio Paisley Emblem"
      className={`transition-all duration-500 hover:scale-[1.04] shrink-0 select-none ${className}`}
      {...props}
    >
      <defs>
        {/* Antique matte zari gradient */}
        <linearGradient id={`${uid}-zari`} x1="10%" y1="10%" x2="90%" y2="92%">
          <stop offset="0%" stopColor="#E8CC88" />
          <stop offset="40%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#9A7535" />
        </linearGradient>

        {/* Deep obsidian ink for solid prints */}
        <linearGradient id={`${uid}-ink`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A2A26" />
          <stop offset="100%" stopColor="#0C0B0A" />
        </linearGradient>

        {/* Soft gold glow filter for ambient zari shimmer */}
        <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Optional Gold Tile Background */}
      {isTile && (
        <>
          <rect width="100" height="100" rx="20" fill="#C9A24B" />
          <rect
            x="3.5"
            y="3.5"
            width="93"
            height="93"
            rx="17"
            stroke="#8E6A29"
            strokeWidth="0.9"
            strokeOpacity="0.4"
            fill="none"
          />
        </>
      )}

      {/* Optional Hairline Cartouche Luxury Frame */}
      {isFramed && (
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          rx="2"
          stroke={isMonochrome ? "currentColor" : `url(#${uid}-zari)`}
          strokeWidth="0.8"
          strokeOpacity="0.35"
          fill="none"
        />
      )}

      {/* The Iconic Paisley Mark */}
      <g
        transform={`translate(${tx}, ${ty}) scale(${scale})`}
        stroke={
          isTile
            ? "#0C0B0A"
            : isMonochrome
            ? "currentColor"
            : `url(#${uid}-zari)`
        }
        strokeLinecap="round"
        filter={!isTile && !isMonochrome && variant === "duotone" ? `url(#${uid}-glow)` : undefined}
      >
        {/* Outer sweeping paisley contour */}
        <path
          d="M240 70 C320 80 345 170 305 235 C275 285 205 295 185 250 C170 215 205 190 232 208 C255 224 248 252 228 250"
          strokeWidth={isTile ? "6.5" : "6"}
        />

        {/* Inner whisper accent contour */}
        <path
          d="M240 100 C298 108 318 172 288 220"
          strokeWidth={isTile ? "5" : "4.5"}
          strokeOpacity={isTile ? "0.65" : "0.75"}
        />

        {/* Graduated triple pearls inside the curl */}
        <circle
          cx="262"
          cy="150"
          r="7.5"
          fill={
            isTile
              ? "#0C0B0A"
              : isMonochrome
              ? "currentColor"
              : `url(#${uid}-zari)`
          }
          stroke="none"
        />
        <circle
          cx="280"
          cy="182"
          r="6"
          fill={
            isTile
              ? "#0C0B0A"
              : isMonochrome
              ? "currentColor"
              : `url(#${uid}-zari)`
          }
          stroke="none"
        />
        <circle
          cx="268"
          cy="214"
          r="4.5"
          fill={
            isTile
              ? "#0C0B0A"
              : isMonochrome
              ? "currentColor"
              : `url(#${uid}-zari)`
          }
          stroke="none"
        />
      </g>
    </svg>
  );
};
