import React, { useId } from "react";

interface LogoSealProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  monochrome?: boolean;
}

export const LogoSeal: React.FC<LogoSealProps> = ({
  size = 120,
  monochrome = false,
  className = "",
  ...props
}) => {
  const rawId = useId();
  const uid = `seal-grad-${rawId.replace(/:/g, "")}`;

  // Paisley mark centered in the 260x260 seal at (130, 130)
  const scale = 0.231;
  const tx = 130 - 257.5 * scale;
  const ty = 130 - 182.5 * scale;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 260"
      width={size}
      height={size}
      fill="none"
      aria-label="Rami Studio Master Loom Hallmark Seal"
      className={`group transition-transform duration-700 hover:rotate-3 select-none ${className}`}
      {...props}
    >
      <defs>
        {/* Antique Matte Zari Electroplate Gradient */}
        <linearGradient id={`${uid}-zari`} x1="15%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#DFBF76" />
          <stop offset="40%" stopColor="#C5A059" />
          <stop offset="75%" stopColor="#AD8740" />
          <stop offset="100%" stopColor="#8E6A29" />
        </linearGradient>

        {/* Circular text paths for flawless curved typography */}
        <path
          id={`${uid}-outerText`}
          d="M 130 18 A 112 112 0 1 1 129.9 18"
          fill="none"
        />
        <path
          id={`${uid}-innerText`}
          d="M 130 42 A 88 88 0 1 1 129.9 42"
          fill="none"
        />
      </defs>

      {/* ── 1. EXTERIOR GUILLOCHÉ MILLED BEZEL (48 WEFT HARNESS PINS) ── */}
      {Array.from({ length: 48 }).map((_, i) => {
        const angle = (i * 360) / 48;
        const rad = (angle * Math.PI) / 180;
        const x1 = 130 + 124 * Math.cos(rad);
        const y1 = 130 + 124 * Math.sin(rad);
        const x2 = 130 + 120 * Math.cos(rad);
        const y2 = 130 + 120 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={monochrome ? "currentColor" : `url(#${uid}-zari)`}
            strokeWidth={i % 4 === 0 ? "2" : "1"}
            strokeOpacity={i % 4 === 0 ? "0.9" : "0.5"}
          />
        );
      })}

      {/* ── 2. CONCENTRIC ARCHITECTURAL RINGS ── */}
      {/* Heavy Outer Ring */}
      <circle
        cx="130"
        cy="130"
        r="118"
        stroke={monochrome ? "currentColor" : `url(#${uid}-zari)`}
        strokeWidth="2.5"
      />
      {/* Secondary Inner Hairline */}
      <circle
        cx="130"
        cy="130"
        r="113"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.3"
      />

      {/* ── 3. CIRCULAR HAUTE TYPOGRAPHY ── */}
      <text
        fill={monochrome ? "currentColor" : "#1A1A18"}
        fontSize="8.5"
        fontWeight="600"
        fontFamily="var(--font-sans), monospace"
        letterSpacing="0.32em"
      >
        <textPath href={`#${uid}-outerText`} startOffset="0%">
          ✦ RAMI STUDIO · HAUTE HANDLOOM MAISON · KANCHIPURAM · EST. 2026
        </textPath>
      </text>

      {/* Intermediate Dividing Ring */}
      <circle
        cx="130"
        cy="130"
        r="98"
        stroke={monochrome ? "currentColor" : `url(#${uid}-zari)`}
        strokeWidth="1.2"
      />

      {/* Secondary Micro-Typography */}
      <text
        fill={monochrome ? "currentColor" : "#8A7038"}
        fontSize="6.8"
        fontWeight="500"
        fontFamily="var(--font-sans), monospace"
        letterSpacing="0.28em"
      >
        <textPath href={`#${uid}-innerText`} startOffset="2%">
          ✦ 100% PURE MULBERRY SILK · REAL SILVER ZARI CERTIFIED ✦
        </textPath>
      </text>

      {/* Inner Cartouche Ring */}
      <circle
        cx="130"
        cy="130"
        r="76"
        stroke={monochrome ? "currentColor" : `url(#${uid}-zari)`}
        strokeWidth="2"
      />
      <circle
        cx="130"
        cy="130"
        r="72"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="2 3"
        strokeOpacity="0.4"
      />

      {/* ── 4. RADIAL WEFT SUNBURST RAYS (WARP TENSION SYSTEM) ── */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        const x1 = 130 + 44 * Math.cos(rad);
        const y1 = 130 + 44 * Math.sin(rad);
        const x2 = 130 + 70 * Math.cos(rad);
        const y2 = 130 + 70 * Math.sin(rad);
        return (
          <line
            key={`ray-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={monochrome ? "currentColor" : `url(#${uid}-zari)`}
            strokeWidth="0.75"
            strokeOpacity="0.35"
          />
        );
      })}

      {/* ── 5. CENTERPIECE: PAISLEY SOVEREIGN CREST ── */}
      {/* Background Cartouche Diamond */}
      <rect
        x="106"
        y="106"
        width="48"
        height="48"
        transform="rotate(45 130 130)"
        stroke={monochrome ? "currentColor" : `url(#${uid}-zari)`}
        strokeWidth="1.5"
        fill="#F9F8F6"
      />

      {/* Paisley Hallmark Centerpiece */}
      <g
        transform={`translate(${tx}, ${ty}) scale(${scale})`}
        stroke={monochrome ? "currentColor" : "#1A1A18"}
        strokeLinecap="round"
      >
        {/* Outer silhouette */}
        <path
          d="M240 70 C320 80 345 170 305 235 C275 285 205 295 185 250 C170 215 205 190 232 208 C255 224 248 252 228 250"
          strokeWidth="7"
        />

        {/* Inner contour */}
        <path
          d="M240 100 C298 108 318 172 288 220"
          strokeWidth="5"
          strokeOpacity="0.7"
        />

        {/* Graduated trio of pearls */}
        <circle
          cx="262"
          cy="150"
          r="8"
          fill={monochrome ? "currentColor" : `url(#${uid}-zari)`}
          stroke="none"
        />
        <circle
          cx="280"
          cy="182"
          r="6.5"
          fill={monochrome ? "currentColor" : `url(#${uid}-zari)`}
          stroke="none"
        />
        <circle
          cx="268"
          cy="214"
          r="5"
          fill={monochrome ? "currentColor" : `url(#${uid}-zari)`}
          stroke="none"
        />
      </g>
    </svg>
  );
};
