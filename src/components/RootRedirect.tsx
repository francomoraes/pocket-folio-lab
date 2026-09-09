import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import CircularProgress from "@/shared/components/ui/circular-progress";
import { HomePage } from "@/features/home/components/HomePage";
import { resolveHomePathForRole } from "@/shared/utils/roles";

export const RootRedirect = () => {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate to={resolveHomePathForRole(user?.role)} replace />
    );
  }

  return <HomePage />;
};
