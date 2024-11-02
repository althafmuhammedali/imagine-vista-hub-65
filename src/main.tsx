import { createRoot } from 'react-dom/client';
import { lazy, Suspense, useEffect } from 'react';
import './index.css';

// Lazy load the main App component
const App = lazy(() => import('./App'));

// Fix mobile viewport height
const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Register service worker and handle viewport
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('Service worker registration failed:', error);
    });
    
    // Initial VH calculation
    setVH();
    
    // Recalculate on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100);
    });
  });
}

// Create root and render with Suspense
createRoot(document.getElementById('root')!).render(
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  }>
    <App />
  </Suspense>
);