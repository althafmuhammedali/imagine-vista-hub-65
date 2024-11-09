import { useState, useEffect } from "react";

interface ResponsiveConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: "portrait" | "landscape";
  width: number;
  height: number;
}

export function useResponsiveLayout(): ResponsiveConfig {
  const [layout, setLayout] = useState<ResponsiveConfig>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: "landscape",
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setLayout({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        orientation: height > width ? "portrait" : "landscape",
        width,
        height,
      });
    };

    // Initial update
    updateLayout();

    // Add event listeners
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
    };
  }, []);

  return layout;
}