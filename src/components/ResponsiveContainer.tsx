import { memo } from "react";
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

  const containerClasses = cn(
    "w-full transition-all duration-300 px-2 sm:px-4 md:px-6",
    {
      "space-y-2": isMobile,
      "space-y-4": isTablet,
      "space-y-6": !isMobile && !isTablet,
      "max-w-[100dvw]": orientation === "portrait",
      "max-w-screen-2xl": !isMobile,
      "mx-auto": true
    },
    className
  );

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
});