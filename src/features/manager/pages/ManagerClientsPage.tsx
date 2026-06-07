import { useManagerClients } from "@/features/manager/hooks/useManagerClients";
import { usePendingLinks } from "@/features/manager/hooks/usePendingLinks";
import { ClientCard } from "@/features/manager/components/ClientCard";
import { PendingLinkCard } from "@/features/manager/components/PendingLinkCard";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import CircularProgress from "@/shared/components/ui/circular-progress";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Bell } from "lucide-react";

export const ManagerClientsPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const { clients, isLoading, revokeLink, isRevoking } = useManagerClients({
    search: debouncedSearch || undefined,
    page: 1,
    itemsPerPage: 50,
    sortBy: "name",
    order: "ASC",
  });

  const { pendingLinks, pendingCount, approveLink, rejectLink, isApproving, isRejecting } =
    usePendingLinks();

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">{t("clients.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("clients.subtitle")}</p>
      </div>

      {pendingCount > 0 && (
        <section>
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>
              {pendingCount}{" "}
              {pendingCount === 1
                ? t("clients.pending.singular")
                : t("clients.pending.plural")}
            </AlertTitle>
            <AlertDescription>
              <div className="flex flex-col gap-2 mt-2">
                {pendingLinks.map((link) => (
                  <PendingLinkCard
                    key={link.id}
                    link={link}
                    onApprove={approveLink}
                    onReject={rejectLink}
                    isApproving={isApproving}
                    isRejecting={isRejecting}
                  />
                ))}
              </div>
            </AlertDescription>
          </Alert>
        </section>
      )}

      <section>
        <Input
          placeholder={t("clients.search")}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm mb-4"
        />

        {isLoading ? (
          <CircularProgress />
        ) : clients.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t("clients.table.empty")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {clients.map((client) => (
              <ClientCard
                key={client.investorId}
                client={client}
                onRevoke={revokeLink}
                isRevoking={isRevoking}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
