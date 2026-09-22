import React from "react";

interface LogoWordmarkProps extends React.HTMLAttributes<HTMLDivElement> {
  withDescriptor?: boolean;
  descriptorText?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  theme?: "dark" | "light" | "gold";
  align?: "center" | "left" | "right";
}

export const LogoWordmark: React.FC<LogoWordmarkProps> = ({
  withDescriptor = true,
  descriptorText = "HAUTE HANDLOOM MAISON",
  size = "md",
  theme = "dark",
  align = "center",
  className = "",
  ...props
}) => {
  // Calibrated size, weight, and optical tracking
  const sizeStyles = {
    xs: {
      title: "text-sm sm:text-base tracking-[0.24em] font-medium",
      descriptor: "text-[8px] tracking-[0.38em] mt-0.5",
      line: "w-3",
    },
    sm: {
      title: "text-lg sm:text-xl tracking-[0.26em] font-semibold",
      descriptor: "text-[8.5px] tracking-[0.42em] mt-1",
      line: "w-4",
    },
    md: {
      title: "text-2xl sm:text-3xl tracking-[0.30em] font-semibold",
      descriptor: "text-[9.5px] sm:text-[10px] tracking-[0.46em] mt-1.5",
      line: "w-6",
    },
    lg: {
      title: "text-3xl sm:text-5xl md:text-6xl tracking-[0.32em] font-bold",
      descriptor: "text-[11px] sm:text-xs tracking-[0.52em] mt-2.5",
      line: "w-8",
    },
    xl: {
      title: "text-4xl sm:text-6xl md:text-7xl tracking-[0.35em] font-bold",
      descriptor: "text-xs sm:text-sm tracking-[0.55em] mt-3.5",
      line: "w-10",
    },
  };

  const current = sizeStyles[size] || sizeStyles.md;

  const colorStyles = {
    dark: {
      title: "text-text-primary",
      descriptor: "text-text-secondary",
      accent: "bg-accent-zari",
      dot: "text-accent-zari",
    },
    light: {
      title: "text-canvas-base",
      descriptor: "text-canvas-muted",
      accent: "bg-accent-zari",
      dot: "text-accent-zari",
    },
    gold: {
      title: "text-accent-zari-hover",
      descriptor: "text-text-secondary",
      accent: "bg-accent-zari",
      dot: "text-accent-zari-hover",
    },
  }[theme];

  const alignClasses = {
    center: "items-center text-center justify-center",
    left: "items-start text-left justify-start",
    right: "items-end text-right justify-end",
  }[align];

  return (
    <div
      className={`inline-flex flex-col select-none group cursor-pointer ${alignClasses} ${className}`}
      {...props}
    >
      {/* Primary Brand Inscription */}
      <div className={`relative flex items-center ${align === "center" ? "justify-center" : align === "left" ? "justify-start" : "justify-end"}`}>
        <span
          className={`font-serif uppercase leading-none drop-shadow-xs transition-colors duration-300 group-hover:text-accent-zari-hover ${current.title} ${colorStyles.title}`}
          style={{
            fontFeatureSettings: "'liga' 1, 'kern' 1, 'cpsp' 1",
            textRendering: "geometricPrecision",
          }}
        >
          RAMI STUDIO
        </span>
      </div>

      {/* Classical Haute Couture Descriptor Rule */}
      {withDescriptor && (
        <div
          className={`flex items-center gap-2.5 uppercase font-mono transition-opacity duration-300 opacity-85 group-hover:opacity-100 ${align === "center" ? "justify-center" : align === "left" ? "justify-start" : "justify-end"} ${current.descriptor} ${colorStyles.descriptor}`}
        >
          <span className={`h-[1px] ${current.line} ${colorStyles.accent} opacity-75`} />
          <span className={`text-[7px] ${colorStyles.dot} opacity-90`}>✦</span>
          <span className="font-medium tracking-[0.45em]">
            {descriptorText}
          </span>
          <span className={`text-[7px] ${colorStyles.dot} opacity-90`}>✦</span>
          <span className={`h-[1px] ${current.line} ${colorStyles.accent} opacity-75`} />
        </div>
      )}
    </div>
  );
};
