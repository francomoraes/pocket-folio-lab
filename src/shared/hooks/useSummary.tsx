import { summaryService } from "@/shared/services/summaryService";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useSummary = (investorId?: number) => {
  const {
    data: summaryResponse,
    isLoading: isLoadingSummary,
    error: errorSummary,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: investorId
      ? QUERY_KEYS.clientSummary(investorId)
      : QUERY_KEYS.SUMMARY,
    queryFn: () =>
      investorId
        ? managerService.getClientSummary(investorId)
        : summaryService.getSummary(),
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
    enabled: !investorId,
  });

  return {
    summary: summaryResponse?.data,
    exchangeRate: summaryResponse?.exchangeRate,
    totalPnlCents: summaryResponse?.totalPnlCents,
    cashFlow: summaryResponse?.cashFlow,
    adherence: summaryResponse?.adherence,
    initialWealthCents: summaryResponse?.initialWealthCents,
    absoluteVariationCents: summaryResponse?.absoluteVariationCents,
    percentageVariation: summaryResponse?.percentageVariation,
    isLoadingSummary,
    errorSummary,
    refetchSummary,

    overview,
    isLoadingOverview,
    errorOverview,
    refetchOverview,
  };
};
