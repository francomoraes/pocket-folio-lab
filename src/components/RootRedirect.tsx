import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import CircularProgress from "@/shared/components/ui/circular-progress";

export const RootRedirect = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/positions" : "/login"} replace />;
};
