import CircularProgress from "@/shared/components/ui/circular-progress";
import { useAuth } from "@/shared/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type ProtectedRoutesProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRoutesProps) => {
  const { isAuthenticated, isLoading, isInitializing } = useAuth();
  const navigate = useNavigate();

  if (isInitializing || isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return <>{children}</>;
};
