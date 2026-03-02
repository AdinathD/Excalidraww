"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "outline" | "secondary";
  className?: string;
  onClick?: () => void;
  size: "lg" | "sm";
  children: ReactNode;
}

export const Button = ({ size, variant, className, onClick, children }: ButtonProps) => {
  const getVariantStyles = () => {
    if (variant === "primary") {
      return {
        backgroundColor: "hsl(221 83% 53%)",
        color: "hsl(210 40% 98%)",
      };
    } else if (variant === "secondary") {
      return {
        backgroundColor: "hsl(210 40% 96.1%)",
        color: "hsl(222.2 47.4% 11.2%)",
      };
    } else {
      return {
        backgroundColor: "transparent",
        color: "inherit",
        border: "1px solid hsl(214.3 31.8% 91.4%)",
      };
    }
  };

  const sizeClass = size === "lg" ? "px-4 py-2 text-base" : "px-2 py-1 text-sm";

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-all hover:opacity-90 ${sizeClass} ${className}`}
      style={getVariantStyles()}
      onClick={onClick}
    >
      {children}
    </button>
  );
};