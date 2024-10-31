import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const SignIn = lazy(() => import("@clerk/clerk-react").then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import("@clerk/clerk-react").then(m => ({ default: m.SignUp })));

// Configure QueryClient with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const App = () => (
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
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
                  </div>
                }>
                  <Index />
                </Suspense>
              }
            />
            <Route
              path="/sign-in/*"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SignIn routing="path" path="/sign-in" />
                </Suspense>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SignUp routing="path" path="/sign-up" />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;