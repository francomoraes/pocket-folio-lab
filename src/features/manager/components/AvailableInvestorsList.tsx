import { useAvailableInvestors } from "@/features/manager/hooks/useAvailableInvestors";
import { useAvailableManagers } from "@/features/manager/hooks/useAvailableManagers";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Badge } from "@/shared/components/ui/badge";
import CircularProgress from "@/shared/components/ui/circular-progress";

interface AvailableInvestorsListProps {
  onRequest?: (investorId: number, managerId?: number) => Promise<void>;
  isRequesting?: boolean;
  onView?: (investorId: number) => void;
  showManagerSelector?: boolean;
}

export const AvailableInvestorsList = ({
  onRequest,
  isRequesting,
  onView,
  showManagerSelector,
}: AvailableInvestorsListProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [requestingId, setRequestingId] = useState<number | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { investors, isLoading } = useAvailableInvestors(
    debouncedSearch || undefined,
    showManagerSelector ? selectedManagerId : undefined,
  );
  const { managers } = useAvailableManagers(undefined, showManagerSelector);

  const handleRequest = async (investorId: number) => {
    if (!onRequest) return;
    setRequestingId(investorId);
    try {
      await onRequest(investorId, showManagerSelector ? selectedManagerId : undefined);
    } finally {
      setRequestingId(null);
    }
  };

  const addDisabled = showManagerSelector && !selectedManagerId;

  return (
    <div className="flex flex-col gap-3">
      {showManagerSelector && (
        <div className="space-y-2">
          <Label htmlFor="available-investors-manager">
            {t("clients.selectManager")}
          </Label>
          <Select
            value={selectedManagerId ? String(selectedManagerId) : undefined}
            onValueChange={(v) => setSelectedManagerId(Number(v))}
          >
            <SelectTrigger id="available-investors-manager">
              <SelectValue placeholder={t("clients.selectManager")} />
            </SelectTrigger>
            <SelectContent>
              {managers.map((manager) => (
                <SelectItem key={manager.id} value={String(manager.id)}>
                  {manager.name} — {manager.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
                {investor.currentManagers.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("clients.currentManager")}:{" "}
                    {investor.currentManagers
                      .map((manager) => manager.name)
                      .join(", ")}
                  </p>
                )}
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
                {onRequest && (
                  <Button
                    size="sm"
                    className="flex-1 text-xs px-2"
                    onClick={() => handleRequest(investor.id)}
                    disabled={
                      addDisabled ||
                      (isRequesting && requestingId === investor.id)
                    }
                  >
                    {t("clients.addClient")}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
