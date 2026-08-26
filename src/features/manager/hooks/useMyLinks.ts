import { managerLinkService } from "@/features/manager/services/managerLinkService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useMyLinks = () => {
  const { data: links = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.myLinks,
    queryFn: () => managerLinkService.getMyLinks(),
    staleTime: 30 * 1000,
  });

  return { links, isLoading, error };
};
