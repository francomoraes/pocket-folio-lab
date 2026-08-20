import { useQuery } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/authService";

export const useAuthConfig = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["auth", "config"],
    queryFn: () => authService.getConfig(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    selfRegistrationEnabled: data?.selfRegistrationEnabled ?? false,
    isLoading,
  };
};
