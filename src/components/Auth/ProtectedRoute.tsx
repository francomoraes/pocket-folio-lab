import CircularProgress from "@/components/ui/circular-progress";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type ProtectedRoutesProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRoutesProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
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
