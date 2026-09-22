import React from "react";

interface LogoSealProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const LogoSeal: React.FC<LogoSealProps> = ({
  size = 120,
  className = "",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 240"
      width={size}
      height={size}
      fill="none"
      aria-label="Rami Studio Loom Seal"
      className={className}
      {...props}
    >
      {/* Outer Rim */}
      <circle cx="120" cy="120" r="108" stroke="currentColor" strokeWidth="1.2" />
      {/* Subtle Inner Dashed Track */}
      <circle
        cx="120"
        cy="120"
        r="98"
        stroke="#C5A059"
        strokeWidth="0.8"
        strokeDasharray="3 3"
      />

      {/* Loom Crosshairs / Needle Axes */}
      <line x1="120" y1="36" x2="120" y2="204" stroke="currentColor" strokeWidth="1" />
      <line x1="36" y1="120" x2="204" y2="120" stroke="currentColor" strokeWidth="1" />

      {/* Central Rhombus (Loom Weft Diamond) */}
      <rect
        x="108"
        y="108"
        width="24"
        height="24"
        transform="rotate(45 120 120)"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="#F9F8F6"
      />
      <circle cx="120" cy="120" r="3.5" fill="#1A1A18" />
      <circle cx="120" cy="120" r="1.5" fill="#C5A059" />

      {/* Micro-typography Cardinal Indicators */}
      <text
        x="120"
        y="28"
        textAnchor="middle"
        fill="currentColor"
        fontSize="7.5"
        fontFamily="var(--font-sans), monospace"
        letterSpacing="0.35em"
      >
        WARP
      </text>
      <text
        x="120"
        y="218"
        textAnchor="middle"
        fill="currentColor"
        fontSize="7.5"
        fontFamily="var(--font-sans), monospace"
        letterSpacing="0.35em"
      >
        WEFT
      </text>
      <text
        x="218"
        y="123"
        textAnchor="middle"
        fill="currentColor"
        fontSize="7.5"
        fontFamily="var(--font-sans), monospace"
        letterSpacing="0.35em"
      >
        PURE
      </text>
      <text
        x="24"
        y="123"
        textAnchor="middle"
        fill="currentColor"
        fontSize="7.5"
        fontFamily="var(--font-sans), monospace"
        letterSpacing="0.35em"
      >
        SILK
      </text>
    </svg>
  );
};
