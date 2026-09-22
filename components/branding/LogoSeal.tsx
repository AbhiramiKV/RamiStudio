import React from "react";

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
        <linearGradient id="sealZariGrad" x1="15%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#DFBF76" />
          <stop offset="40%" stopColor="#C5A059" />
          <stop offset="75%" stopColor="#AD8740" />
          <stop offset="100%" stopColor="#8E6A29" />
        </linearGradient>

        {/* Circular text paths for flawless curved typography */}
        <path
          id="sealOuterTextPath"
          d="M 130 18 A 112 112 0 1 1 129.9 18"
          fill="none"
        />
        <path
          id="sealInnerTextPath"
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
            stroke={monochrome ? "currentColor" : "url(#sealZariGrad)"}
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
        stroke={monochrome ? "currentColor" : "url(#sealZariGrad)"}
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
        <textPath href="#sealOuterTextPath" startOffset="0%">
          ✦ RAMI STUDIO · HAUTE HANDLOOM MAISON · KANCHIPURAM · EST. 2026
        </textPath>
      </text>

      {/* Intermediate Dividing Ring */}
      <circle
        cx="130"
        cy="130"
        r="98"
        stroke={monochrome ? "currentColor" : "url(#sealZariGrad)"}
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
        <textPath href="#sealInnerTextPath" startOffset="2%">
          ✦ 100% PURE MULBERRY SILK · REAL SILVER ZARI CERTIFIED ✦
        </textPath>
      </text>

      {/* Inner Cartouche Ring */}
      <circle
        cx="130"
        cy="130"
        r="76"
        stroke={monochrome ? "currentColor" : "url(#sealZariGrad)"}
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
            stroke={monochrome ? "currentColor" : "url(#sealZariGrad)"}
            strokeWidth="0.75"
            strokeOpacity="0.35"
          />
        );
      })}

      {/* ── 5. CENTERPIECE: IMPERIAL 'RS' SOVEREIGN CREST ── */}
      {/* Background Cartouche Diamond */}
      <rect
        x="106"
        y="106"
        width="48"
        height="48"
        transform="rotate(45 130 130)"
        stroke={monochrome ? "currentColor" : "url(#sealZariGrad)"}
        strokeWidth="1.5"
        fill="#F9F8F6"
      />

      {/* Sculpted Bold 'R' in Seal */}
      <path
        d="M 112 110 H 125 C 134 110 140 114 140 121 C 140 127 135 131 126 131 H 118 V 148 H 112 Z M 118 116 V 125 H 124 C 128 125 132 124 132 121 C 132 117 128 116 124 116 Z"
        fill={monochrome ? "currentColor" : "#1A1A18"}
      />
      {/* 'R' Tail */}
      <path
        d="M 124 131 L 138 148 H 146 L 131 129 Z"
        fill={monochrome ? "currentColor" : "#1A1A18"}
      />

      {/* Golden 'S' Ribbon Intertwining */}
      <path
        d="M 143 115 C 140 111 133 110 126 112 C 121 113 119 117 121 120 C 122 122 125 123 129 125 L 133 126 C 139 128 143 132 142 138 C 141 144 135 149 126 150 C 119 151 114 147 113 143 H 118 C 118 145 122 147 126 146 C 131 145 135 142 136 137 C 136 132 133 130 128 128 L 123 126 C 118 124 115 120 116 115 C 117 109 123 106 130 106 C 137 106 143 109 144 115 Z"
        fill={monochrome ? "currentColor" : "url(#sealZariGrad)"}
      />

      {/* Central Diamond Hallmark Accent */}
      <g transform="translate(130, 130)">
        <polygon points="0,-4 3,0 0,4 -3,0" fill={monochrome ? "currentColor" : "url(#sealZariGrad)"} />
      </g>
    </svg>
  );
};
