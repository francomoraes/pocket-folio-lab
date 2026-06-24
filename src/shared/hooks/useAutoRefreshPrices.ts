import { useEffect, useRef } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { assetService } from "@/features/positions/services/assetService";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { toast } from "sonner";

const LAST_REFRESH_KEY = "lastPriceRefreshAt";
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export function useAutoRefreshPrices() {
  const { isAuthenticated, isInitializing } = useAuth();
  const queryClient = useQueryClient();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (isInitializing || !isAuthenticated || hasChecked.current) return;
    hasChecked.current = true;

    const lastRefresh = localStorage.getItem(LAST_REFRESH_KEY);
    const lastRefreshTime = lastRefresh ? Number(lastRefresh) : 0;
    const elapsed = Date.now() - lastRefreshTime;

    if (elapsed < TWENTY_FOUR_HOURS_MS) return;

    assetService
      .refreshMarketPrices()
      .then((result) => {
        localStorage.setItem(LAST_REFRESH_KEY, String(Date.now()));

        if (!result.usedCacheOnly) {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSETS });
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUMMARY });
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW });
          toast.info(
            `Cotações atualizadas automaticamente (${result.updated} ativos)`,
          );
        }
      })
      .catch(() => {
        // Silently ignore — user can manually refresh later
      });
  }, [isAuthenticated, isInitializing, queryClient]);
}
