import { useAvailableManagers } from "@/features/manager/hooks/useAvailableManagers";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Badge } from "@/shared/components/ui/badge";
import CircularProgress from "@/shared/components/ui/circular-progress";

interface AvailableManagersListProps {
  onRequest: (managerId: number) => Promise<void>;
  isRequesting: boolean;
}

export const AvailableManagersList = ({
  onRequest,
  isRequesting,
}: AvailableManagersListProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [requestingId, setRequestingId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { managers, isLoading } = useAvailableManagers(
    debouncedSearch || undefined,
  );

  const handleRequest = async (managerId: number) => {
    setRequestingId(managerId);
    try {
      await onRequest(managerId);
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder={t("managers.searchManagers")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div className="flex justify-center py-4">
          <CircularProgress />
        </div>
      ) : managers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t("managers.noManagersFound")}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {managers.map((manager) => (
            <div
              key={manager.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{manager.name}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {manager.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{manager.email}</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleRequest(manager.id)}
                disabled={isRequesting && requestingId === manager.id}
              >
                {t("managers.requestManager")}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
