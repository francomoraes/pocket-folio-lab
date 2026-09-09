import { useQuery } from "@tanstack/react-query";
import { exchangeRateService } from "@/shared/services/exchangeRateService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

export const useExchangeRate = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.EXCHANGE_RATE,
    queryFn: () => exchangeRateService.getExchangeRate(),
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  return { exchangeRate: data, isLoading, error };
};
