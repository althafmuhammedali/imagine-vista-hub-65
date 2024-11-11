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

// Performance cache for layout calculations
const layoutCache = new Map<string, ResponsiveConfig>();

export function useResponsiveLayout(): ResponsiveConfig {
  const [layout, setLayout] = useState<ResponsiveConfig>(() => {
    // Check cache first
    const cacheKey = `${window.innerWidth}-${window.innerHeight}`;
    const cached = layoutCache.get(cacheKey);
    
    if (cached) return cached;
    
    const initial = calculateLayout(
      typeof window !== "undefined" ? window.innerWidth : 1200,
      typeof window !== "undefined" ? window.innerHeight : 800
    );
    
    layoutCache.set(cacheKey, initial);
    return initial;
  });

  // Memoize breakpoint calculations for performance
  const calculateLayout = useCallback((width: number, height: number): ResponsiveConfig => {
    const cacheKey = `${width}-${height}`;
    const cached = layoutCache.get(cacheKey);
    
    if (cached) return cached;
    
    const config = {
      isMobile: width < MOBILE_BREAKPOINT,
      isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
      isDesktop: width >= TABLET_BREAKPOINT,
      orientation: height > width ? "portrait" : "landscape",
      width,
      height,
    } as const;
    
    layoutCache.set(cacheKey, config);
    return config;
  }, []);

  // Optimized update function using RAF and Intersection Observer
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
    if (typeof window === "undefined") return;

    // Use ResizeObserver for more efficient size monitoring
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      debouncedUpdate(width, height);
    });

    resizeObserver.observe(document.documentElement);

    // Optimized orientation change handler
    const orientationHandler = () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const { innerWidth, innerHeight } = window;
          debouncedUpdate(innerWidth, innerHeight);
        }, 100);
      });
    };

    window.addEventListener("orientationchange", orientationHandler, { passive: true });

    return () => {
      debouncedUpdate.cancel();
      resizeObserver.disconnect();
      window.removeEventListener("orientationchange", orientationHandler);
    };
  }, [debouncedUpdate]);

  return layout;
}