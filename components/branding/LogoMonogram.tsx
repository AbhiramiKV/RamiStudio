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
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      aria-label="Rami Studio Sovereign Monogram"
      className={`group transition-all duration-500 hover:scale-[1.04] shrink-0 select-none ${className}`}
      {...props}
    >
      <defs>
        {/* Imperial Antique Matte Zari Gradient */}
        <linearGradient id="ramiImperialZari" x1="15%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#DFBF76" />
          <stop offset="35%" stopColor="#C5A059" />
          <stop offset="70%" stopColor="#AD8740" />
          <stop offset="100%" stopColor="#8E6A29" />
        </linearGradient>

        {/* Deep Obsidian Silk Sheen */}
        <linearGradient id="ramiObsidianSilk" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C2C28" />
          <stop offset="50%" stopColor="#1A1A18" />
          <stop offset="100%" stopColor="#0F0F0E" />
        </linearGradient>

        {/* Subtle Zari Shadow for 3D Over-Under Loom Depth */}
        <filter id="zariLoomShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* ── BACKGROUND HERALDRY EMBLEM / CARTUCHE (OPTIONAL SUBTLE LUXURY FRAME) ── */}
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="2"
        stroke={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"}
        strokeWidth="1"
        strokeOpacity="0.3"
        fill="none"
      />
      {/* Corner Loom Harness Notches */}
      <line x1="6" y1="18" x2="6" y2="6" stroke={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} strokeWidth="2.5" />
      <line x1="6" y1="6" x2="18" y2="6" stroke={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} strokeWidth="2.5" />
      <line x1="114" y1="18" x2="114" y2="6" stroke={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} strokeWidth="2.5" />
      <line x1="114" y1="6" x2="102" y2="6" stroke={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} strokeWidth="2.5" />
      <line x1="6" y1="102" x2="6" y2="114" stroke={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} strokeWidth="2.5" />
      <line x1="6" y1="114" x2="18" y2="114" stroke={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} strokeWidth="2.5" />
      <line x1="114" y1="102" x2="114" y2="114" stroke={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} strokeWidth="2.5" />
      <line x1="114" y1="114" x2="102" y2="114" stroke={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} strokeWidth="2.5" />

      {/* ── 1. BOLD ROMAN 'R' ARCHITECTURE (CHISELED PILLARS & SERIFS) ── */}
      {/* Vertical Main Stem with Bracketed Imperial Serifs */}
      <path
        d="M 22 22 H 42 V 28 H 36 V 92 H 44 V 98 H 20 V 92 H 28 V 28 H 22 Z"
        fill={isMonochrome ? "currentColor" : "url(#ramiObsidianSilk)"}
      />

      {/* Noble Roman 'R' Upper Bowl with Chiseled Contrast */}
      <path
        d="M 36 24 H 62 C 78 24 88 32 88 44 C 88 56 78 64 62 64 H 36 V 56 H 60 C 71 56 77 52 77 44 C 77 36 71 32 60 32 H 36 Z"
        fill={isMonochrome ? "currentColor" : "url(#ramiObsidianSilk)"}
      />

      {/* ── 2. SCULPTURAL SILK 'R' DRAPE LEG (OUTWARD PALLU SWAY) ── */}
      {/* Saree Pallu Tail: Dynamic sweeping calligraphic leg terminating in an upturned finial */}
      <path
        d="M 48 59 C 55 59 62 65 67 73 L 83 92 C 87 97 91 98 98 98 V 92 C 94 92 91 90 87 85 L 72 67 C 67 60 59 55 48 55 Z"
        fill={isMonochrome ? "currentColor" : "url(#ramiObsidianSilk)"}
      />

      {/* ── 3. INTERTWINED HAUTE COUTURE 'S' (PURE MATTE ZARI RIBBON) ── */}
      {/* The 'S' ribbon physically weaves over and under the 'R' like warp & weft threads */}
      <g filter={isMonochrome ? undefined : "url(#zariLoomShadow)"}>
        {/* Upper Arch of 'S' - Sweeps over the crown of the R Bowl */}
        <path
          d="M 88 28 C 84 19 72 16 58 19 C 47 21 44 28 47 34 C 49 38 54 41 62 44 L 72 48 C 84 53 91 61 90 73 C 89 85 78 94 62 96 C 48 98 39 91 38 84 H 45 C 46 88 52 91 62 90 C 72 89 80 84 81 74 C 82 65 76 60 66 56 L 56 52 C 45 47 40 40 41 31 C 42 20 53 14 66 14 C 79 14 91 19 93 28 Z"
          fill={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"}
        />
      </g>

      {/* ── 4. WARP-WEFT RELIEF NOTCH ACCENTS (INTERLOCKING ILLUSION) ── */}
      {/* Negative relief cutouts across intersection axes */}
      <rect x="33" y="47" width="6" height="3" fill="#F9F8F6" transform="rotate(-15 36 48)" opacity="0.9" />
      <rect x="56" y="58" width="8" height="3" fill="#F9F8F6" transform="rotate(25 60 59)" opacity="0.9" />

      {/* ── 5. HAUTE JOAILLERIE WEFT DIAMOND (THE MASTER-LOOM EYELET) ── */}
      <g transform="translate(60, 59)">
        {/* Outer Radiant Zari Diamond */}
        <path
          d="M 0 -5 L 4 0 L 0 5 L -4 0 Z"
          fill={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"}
        />
        {/* Core Obsidian Micro-Dot */}
        <circle cx="0" cy="0" r="1.3" fill="#1A1A18" />
      </g>

      {/* Cardinal Alignment Pips (Guilloché Hallmark Accents) */}
      <circle cx="60" cy="9" r="1.5" fill={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} />
      <circle cx="60" cy="111" r="1.5" fill={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} />
      <circle cx="9" cy="60" r="1.5" fill={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} />
      <circle cx="111" cy="60" r="1.5" fill={isMonochrome ? "currentColor" : "url(#ramiImperialZari)"} />
    </svg>
  );
};
