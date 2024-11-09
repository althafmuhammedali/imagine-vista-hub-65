import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ResponsiveContainer } from "@/components/ResponsiveContainer";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const SignIn = lazy(() => import("@clerk/clerk-react").then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import("@clerk/clerk-react").then(m => ({ default: m.SignUp })));

// Configure QueryClient with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
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
          <ResponsiveContainer>
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Index />
                  </Suspense>
                }
              />
              <Route
                path="/sign-in/*"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <SignIn routing="path" path="/sign-in" />
                  </Suspense>
                }
              />
              <Route
                path="/sign-up/*"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <SignUp routing="path" path="/sign-up" />
                  </Suspense>
                }
              />
            </Routes>
          </ResponsiveContainer>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
