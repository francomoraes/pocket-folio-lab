import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/queryClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { RootRedirect } from "@/components/RootRedirect";
import { useAutoRefreshPrices } from "@/shared/hooks/useAutoRefreshPrices";
import "@/shared/i18n/config";
import { UserProfile } from "@/pages/UserProfile";
import { ManagerLinksPage } from "@/features/manager/pages/ManagerLinksPage";
import { ManagerDashboardPage } from "@/features/manager/pages/ManagerDashboardPage";
import { ManagerClientsPage } from "@/features/manager/pages/ManagerClientsPage";
import { ClientPositionsPage } from "@/features/manager/pages/ClientPositionsPage";
import { ClientTargetsPage } from "@/features/manager/pages/ClientTargetsPage";

function AutoRefreshPrices() {
  useAutoRefreshPrices();
  return null;
}

const App = () => (
  <ErrorBoundary
    fallback={<ErrorFallback />}
    onError={(error, errorInfo) => {
      console.error("Global error", error, errorInfo);
    }}
  >
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AutoRefreshPrices />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />

            <Routes>
              <Route path="/" element={<RootRedirect />} />
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

              {/* Vínculos gestor-cliente: qualquer role autenticada pode ter seus próprios gestores */}
              <Route
                path="/my-managers"
                element={
                  <ProtectedRoute>
                    <ManagerLinksPage />
                  </ProtectedRoute>
                }
              />

              {/* Manager routes */}
              <Route
                path="/manager/dashboard"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <ManagerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/clients"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <ManagerClientsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/clients/:investorId/positions"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <ClientPositionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/clients/:investorId/targets"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <ClientTargetsPage />
                  </ProtectedRoute>
                }
              />

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
