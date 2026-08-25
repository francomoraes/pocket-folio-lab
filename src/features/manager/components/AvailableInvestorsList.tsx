import { useAvailableInvestors } from "@/features/manager/hooks/useAvailableInvestors";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Badge } from "@/shared/components/ui/badge";
import CircularProgress from "@/shared/components/ui/circular-progress";

interface AvailableInvestorsListProps {
  onRequest: (targetUserId: number) => Promise<void>;
  isRequesting: boolean;
  onView?: (investorId: number) => void;
}

export const AvailableInvestorsList = ({
  onRequest,
  isRequesting,
  onView,
}: AvailableInvestorsListProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [requestingId, setRequestingId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { investors, isLoading } = useAvailableInvestors(
    debouncedSearch || undefined,
  );

  const handleRequest = async (targetUserId: number) => {
    setRequestingId(targetUserId);
    try {
      await onRequest(targetUserId);
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder={t("clients.searchInvestors")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div className="flex justify-center py-4">
          <CircularProgress />
        </div>
      ) : investors.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t("clients.noInvestorsFound")}
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[65vh] overflow-y-auto pr-1">
          {investors.map((investor) => (
            <div
              key={investor.id}
              className="flex flex-col gap-2 p-3 border rounded-lg"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{investor.name}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {investor.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {investor.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {onView && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs px-2"
                    onClick={() => onView(investor.id)}
                  >
                    {t("clients.table.viewPortfolio")}
                  </Button>
                )}
                <Button
                  size="sm"
                  className="flex-1 text-xs px-2"
                  onClick={() => handleRequest(investor.id)}
                  disabled={isRequesting && requestingId === investor.id}
                >
                  {t("clients.requestClient")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
