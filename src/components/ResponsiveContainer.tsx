import { memo, useMemo } from "react";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer = memo(function ResponsiveContainer({ 
  children, 
  className 
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, orientation } = useResponsiveLayout();

  // Memoize class calculations
  const containerClasses = useMemo(() => cn(
    "w-full transition-all duration-300 will-change-transform",
    {
      "px-2 py-1 space-y-2": isMobile,
      "px-4 py-2 space-y-4": isTablet,
      "px-6 py-3 space-y-6": !isMobile && !isTablet,
      "max-w-[100dvw]": orientation === "portrait",
    },
    className
  ), [isMobile, isTablet, orientation, className]);

  // Use CSS containment for better performance
  return (
    <div 
      className={containerClasses}
      style={{
        contain: "content",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased"
      }}
    >
      {children}
    </div>
  );
});