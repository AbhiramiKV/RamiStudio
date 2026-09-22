import React from "react";

interface LogoWordmarkProps extends React.HTMLAttributes<HTMLDivElement> {
  withDescriptor?: boolean;
  size?: "sm" | "md" | "lg";
}

export const LogoWordmark: React.FC<LogoWordmarkProps> = ({
  withDescriptor = true,
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "text-lg tracking-[0.22em]",
    md: "text-2xl md:text-3xl tracking-[0.28em]",
    lg: "text-4xl md:text-5xl tracking-[0.32em]",
  };

  return (
    <div
      className={`inline-flex flex-col items-center select-none text-center ${className}`}
      {...props}
    >
      <span
        className={`font-serif font-light text-text-primary uppercase leading-none ${sizeClasses[size]}`}
        style={{ fontFeatureSettings: "'liga' 1, 'swsh' 1" }}
      >
        Rami Studio
      </span>
      {withDescriptor && (
        <div className="flex items-center gap-2 mt-1.5 opacity-80">
          <span className="w-5 h-[1px] bg-accent-zari/60" />
          <span className="text-[9px] tracking-[0.45em] uppercase text-text-secondary font-mono">
            Silk Architecture
          </span>
          <span className="w-5 h-[1px] bg-accent-zari/60" />
        </div>
      )}
    </div>
  );
};
