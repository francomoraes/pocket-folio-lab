import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { ClientScope } from "@/shared/types/manager";
import { useQuery } from "@tanstack/react-query";

export const useManagerDashboard = (params?: { scope?: ClientScope }) => {
  const scope = params?.scope ?? "mine";

  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.managerDashboard, scope],
    queryFn: () => managerService.getDashboard(params),
    staleTime: 60 * 1000,
  });

  return { dashboard: data, isLoading, error };
};
