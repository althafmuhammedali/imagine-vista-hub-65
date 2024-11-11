import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";

interface ResponsiveConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: "portrait" | "landscape";
  width: number;
  height: number;
}

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

export function useResponsiveLayout(): ResponsiveConfig {
  const [layout, setLayout] = useState<ResponsiveConfig>(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: "landscape",
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  }));

  // Memoize breakpoint calculations
  const calculateLayout = useCallback((width: number, height: number): ResponsiveConfig => ({
    isMobile: width < MOBILE_BREAKPOINT,
    isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
    isDesktop: width >= TABLET_BREAKPOINT,
    orientation: height > width ? "portrait" : "landscape",
    width,
    height,
  }), []);

  // Debounced update function using requestAnimationFrame
  const debouncedUpdate = useMemo(
    () =>
      debounce((width: number, height: number) => {
        requestAnimationFrame(() => {
          setLayout(calculateLayout(width, height));
        });
      }, 16), // ~60fps
    [calculateLayout]
  );

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      debouncedUpdate(width, height);
    };

    // Initial update without debouncing
    setLayout(calculateLayout(window.innerWidth, window.innerHeight));

    // Add event listeners with passive option for better performance
    window.addEventListener("resize", updateLayout, { passive: true });
    window.addEventListener("orientationchange", updateLayout, { passive: true });
    
    // Cleanup
    return () => {
      debouncedUpdate.cancel();
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
    };
  }, [calculateLayout, debouncedUpdate]);

  // Memoize the final layout to prevent unnecessary re-renders
  return useMemo(() => layout, [layout]);
}