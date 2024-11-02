import { createRoot } from 'react-dom/client';
import { lazy, Suspense, useEffect } from 'react';
import './index.css';

// Lazy load the main App component
const App = lazy(() => import('./App'));

// Fix mobile viewport height with debouncing
const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Register service worker and handle viewport with error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    
    // Initial VH calculation
    setVH();
    
    // Debounced resize handler
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(setVH, 150);
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(setVH, 150);
    });
  });
}

// Create root with error handling
const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find root element');
}

const root = createRoot(container);

root.render(
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  }>
    <App />
  </Suspense>
);