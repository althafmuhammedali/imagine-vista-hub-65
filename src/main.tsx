import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
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