import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';

const App = lazy(() => {
  // Preload critical components
  const preloadPromise = import('./App');
  import('./components/ImageGenerator');
  import('./components/LoadingSpinner');
  return preloadPromise;
});

// Optimized viewport height handler
const setVH = () => {
  requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  });
};

// PWA registration with performance optimizations
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { 
      scope: '/',
      type: 'module'
    });
    
    // Initial viewport height
    setVH();
    
    // Optimized resize handler
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
      }
      resizeTimeout = requestAnimationFrame(setVH);
    }, { passive: true });
    
    // Optimized orientation change handler
    window.addEventListener('orientationchange', () => {
      requestAnimationFrame(() => {
        setTimeout(setVH, 100);
      });
    }, { passive: true });
  });
}

// Create root with optimized hydration
const root = createRoot(document.getElementById('root')!);

// Render with optimized loading state
root.render(
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  }>
    <App />
  </Suspense>
);