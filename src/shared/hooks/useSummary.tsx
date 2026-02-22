import { summaryService } from "@/shared/services/summaryService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useSummary = () => {
  const {
    data: summaryResponse,
    isLoading: isLoadingSummary,
    error: errorSummary,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: QUERY_KEYS.SUMMARY,
    queryFn: () => summaryService.getSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const {
    data: overview,
    isLoading: isLoadingOverview,
    error: errorOverview,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: QUERY_KEYS.OVERVIEW,
    queryFn: () => summaryService.getOverviewByCurrency(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    summary: summaryResponse?.data,
    exchangeRate: summaryResponse?.exchangeRate,
    isLoadingSummary,
    errorSummary,
    refetchSummary,

    overview,
    isLoadingOverview,
    errorOverview,
    refetchOverview,
  };
};
