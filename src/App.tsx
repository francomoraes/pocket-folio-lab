import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { LoginForm } from "@/features/auth/components/LoginForm";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Settings } from "@/pages/Settings";
import { Positions } from "@/pages/Positions";
import { Dashboard } from "@/pages/Dashboard";
import { Navbar } from "@/shared/components/Layout";
import {
  ErrorBoundary,
  ErrorFallback,
} from "@/shared/components/ErrorBoundary";
import "@/shared/i18n/config";
import { UserProfile } from "@/pages/UserProfile";

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

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
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
