import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const SignIn = lazy(() => import("@clerk/clerk-react").then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import("@clerk/clerk-react").then(m => ({ default: m.SignUp })));

// Configure QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
      networkMode: 'always',
    },
  },
});

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const App = () => (
  <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Index />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="/sign-in/*"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <SignIn routing="path" path="/sign-in" />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="/sign-up/*"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <SignUp routing="path" path="/sign-up" />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </ErrorBoundary>
);

export default App;