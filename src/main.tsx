import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';

declare global {
  interface Window {
    chrome?: {
      runtime?: {
        id?: string;
      };
    };
  }
}

const App = lazy(() => {
  const preloadPromise = import('./App');
  import('./components/ImageGenerator');
  import('./components/LoadingSpinner');
  return preloadPromise;
});

const setVH = () => {
  requestAnimationFrame(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
};

// Check if we're running as an extension
const isExtension = typeof window.chrome !== 'undefined' && window.chrome?.runtime?.id;

if ('serviceWorker' in navigator && !isExtension) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { 
      scope: '/',
      type: 'module'
    });
    
    setVH();
    
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
      }
      resizeTimeout = requestAnimationFrame(setVH);
    }, { passive: true });
    
    window.addEventListener('orientationchange', () => {
      requestAnimationFrame(() => {
        setTimeout(setVH, 100);
      });
    }, { passive: true });
  });
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  const root = createRoot(rootElement);

  root.render(
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    }>
      <App />
    </Suspense>
  );
});