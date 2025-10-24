import { summaryService } from "@/services/summaryService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const SUMMARY_QUERY_KEY = ["summary"];
const OVERVIEW_QUERY_KEY = ["overview"];

export const useSummary = () => {
  const {
    data: summary,
    isLoading: isLoadingSummary,
    error: errorSummary,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: SUMMARY_QUERY_KEY,
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
    queryKey: OVERVIEW_QUERY_KEY,
    queryFn: () => summaryService.getOverviewByCurrency(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    summary,
    isLoadingSummary,
    errorSummary,
    refetchSummary,

    overview,
    isLoadingOverview,
    errorOverview,
    refetchOverview,
  };
};
