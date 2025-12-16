import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/Auth";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { Settings } from "@/pages/Settings";
import { Positions } from "@/pages/Positions";
import { Dashboard } from "@/pages/Dashboard";
import { Navbar } from "@/components/Layout";
import {
  ErrorBoundary,
  ErrorFallback,
} from "@/shared/components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary
    fallback={<ErrorFallback />}
    onError={(error, errorInfo) => {
      console.error("Global error", error, errorInfo);
    }}
  >
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />

            <Routes>
              <Route path="/" element={<Navigate to="/positions" replace />} />
              <Route
                path="/positions"
                element={
                  <ProtectedRoute>
                    <Positions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginForm />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
