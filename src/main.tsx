import { createRoot } from 'react-dom/client';
import { lazy, Suspense, useEffect, useState } from 'react';
import './index.css';

const App = lazy(() => {
  const preloadPromise = import('./App');
  import('./components/ImageGenerator');
  import('./components/LoadingSpinner');
  return preloadPromise;
});

// Fix mobile viewport height
const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// PWA install prompt
const PWAPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  if (!deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-amber-500 text-white p-4 rounded-lg shadow-lg">
      <p>Install ComicForge AI app?</p>
      <button 
        onClick={handleInstall}
        className="mt-2 bg-white text-amber-500 px-4 py-2 rounded"
      >
        Install
      </button>
    </div>
  );
};

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
    
    setVH();
    
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

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  }>
    <>
      <App />
      <PWAPrompt />
    </>
  </Suspense>
);