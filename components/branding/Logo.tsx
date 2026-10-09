import React from "react";
import Link from "next/link";
import { LogoMonogram } from "./LogoMonogram";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "full" | "mark" | "wordmark" | "tile";
  layout?: "stacked" | "inline";
  theme?: "gold" | "dark" | "light" | "transparent";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  href?: string;
  withDescriptor?: boolean;
  descriptorText?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  layout = "stacked",
  theme = "transparent",
  size = "md",
  href,
  withDescriptor = false,
  descriptorText = "HAUTE HANDLOOM MAISON",
  className = "",
  ...props
}) => {
  const sizeMap = {
    xs: {
      mark: 20,
      title: "text-sm tracking-[0.24em]",
      sub: "text-[7.5px] tracking-[0.3em]",
      gap: "gap-1",
      pad: "p-2",
    },
    sm: {
      mark: 28,
      title: "text-lg tracking-[0.26em]",
      sub: "text-[9px] tracking-[0.34em]",
      gap: "gap-1.5",
      pad: "p-3",
    },
    md: {
      mark: 40,
      title: "text-2xl tracking-[0.30em]",
      sub: "text-[10px] tracking-[0.40em]",
      gap: "gap-2",
      pad: "p-4",
    },
    lg: {
      mark: 56,
      title: "text-4xl tracking-[0.32em]",
      sub: "text-xs tracking-[0.45em]",
      gap: "gap-3",
      pad: "p-6",
    },
    xl: {
      mark: 72,
      title: "text-5xl tracking-[0.35em]",
      sub: "text-sm tracking-[0.50em]",
      gap: "gap-4",
      pad: "p-8",
    },
  }[size];

  const themeColors = {
    gold: {
      bg: "bg-[#C9A24B] text-[#0C0B0A] shadow-md border border-[#B8923D]",
      markColor: "text-[#0C0B0A]",
      titleColor: "text-[#0C0B0A]",
      subColor: "text-[#0C0B0A]/85",
      monoVariant: "solid" as const,
    },
    dark: {
      bg: "bg-transparent text-text-primary",
      markColor: "text-text-primary",
      titleColor: "text-text-primary",
      subColor: "text-text-secondary",
      monoVariant: "duotone" as const,
    },
    light: {
      bg: "bg-transparent text-canvas-base",
      markColor: "text-canvas-base",
      titleColor: "text-canvas-base",
      subColor: "text-canvas-muted",
      monoVariant: "solid" as const,
    },
    transparent: {
      bg: "bg-transparent text-text-primary",
      markColor: "text-accent-zari-hover",
      titleColor: "text-text-primary",
      subColor: "text-text-secondary",
      monoVariant: "duotone" as const,
    },
  }[theme];

  const content = (
    <div
      className={`select-none inline-flex transition-all duration-300 ${
        theme === "gold" || variant === "tile" ? `${themeColors.bg} rounded-xs ${sizeMap.pad}` : ""
      } ${
        layout === "inline"
          ? "flex-row items-center gap-3"
          : "flex-col items-center justify-center text-center"
      } ${sizeMap.gap} ${className}`}
      {...props}
    >
      {/* Mark Component */}
      {(variant === "full" || variant === "mark" || variant === "tile") && (
        <LogoMonogram
          size={sizeMap.mark}
          variant={theme === "gold" ? "solid" : themeColors.monoVariant}
          className={`${themeColors.markColor} transition-transform duration-300 hover:scale-105`}
        />
      )}

      {/* Typography Block */}
      {(variant === "full" || variant === "wordmark" || variant === "tile") && (
        <div className="flex flex-col items-center leading-none">
          <span
            className={`font-serif uppercase font-semibold ${sizeMap.title} ${themeColors.titleColor}`}
            style={{
              fontFeatureSettings: "'liga' 1, 'kern' 1",
              textRendering: "geometricPrecision",
            }}
          >
            RAMI
          </span>
          <span
            className={`font-sans uppercase font-medium mt-1 ${sizeMap.sub} ${themeColors.subColor}`}
          >
            STUDIO
          </span>

          {withDescriptor && (
            <span className="text-[7.5px] font-mono tracking-[0.35em] uppercase text-text-tertiary mt-2">
              ✦ {descriptorText} ✦
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Rami Studio Home" className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
};
