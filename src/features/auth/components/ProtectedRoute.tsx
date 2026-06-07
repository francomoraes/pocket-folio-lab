import CircularProgress from "@/shared/components/ui/circular-progress";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserRole } from "@/shared/types/roles";
import { Navigate } from "react-router-dom";

type ProtectedRoutesProps = {
  children: React.ReactNode;
  requiredRole?: UserRole;
};

function hasAccess(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (requiredRole === "admin") return userRole === "admin";
  if (requiredRole === "manager") return userRole === "manager" || userRole === "admin";
  if (requiredRole === "investor") return userRole === "investor";
  return true;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRoutesProps) => {
  const { isAuthenticated, isLoading, isInitializing, user } = useAuth();

  if (isInitializing || isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasAccess(user?.role, requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
