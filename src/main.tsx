import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';

// Lazy load the main App component
const App = lazy(() => import('./App'));

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