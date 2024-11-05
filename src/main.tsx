import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';

// Lazy load the main App component with preload
const App = lazy(() => {
  const preloadPromise = import('./App');
  // Preload other critical components
  import('./components/ImageGenerator');
  import('./components/LoadingSpinner');
  return preloadPromise;
});

// Fix mobile viewport height
const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Register service worker with immediate activation
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { immediate: true })
      .then(registration => {
        registration.addEventListener('activate', () => {
          // Claim clients and refresh for immediate SW control
          registration.active?.clients.claim();
        });
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
    
    // Initial VH calculation
    setVH();
    
    // Debounced resize handler
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(setVH, 150);
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100);
    });
  });
}

// Create root with concurrent mode
createRoot(document.getElementById('root')!).render(
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  }>
    <App />
  </Suspense>
);