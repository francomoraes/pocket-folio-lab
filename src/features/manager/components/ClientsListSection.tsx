import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useManagerClients } from "@/features/manager/hooks/useManagerClients";
import { LinkStatusBadge } from "@/features/manager/components/LinkStatusBadge";
import { RiskProfileBadge } from "@/shared/components/RiskProfileBadge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { SortableTableHead } from "@/shared/components/ui/sortable-table-head";
import { PaginationControls } from "@/shared/components/ui/pagination-control";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import CircularProgress from "@/shared/components/ui/circular-progress";
import { usePagination } from "@/shared/hooks/usePagination";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  formatAdherence,
  formatCentsToCurrency,
  formatVariation,
  getAdherenceColor,
  getVariationColor,
} from "@/shared/utils/formatters";
import { ClientScope, ClientSortBy, ManagerClient } from "@/shared/types/manager";

const CLIENTS_ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

interface ClientsListSectionProps {
  scope: ClientScope;
  currency: "BRL" | "USD";
  usdToBrlRate: number;
}

export const ClientsListSection = ({
  scope,
  currency,
  usdToBrlRate,
}: ClientsListSectionProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPlatformWide = scope === "all";
  const [showEndedLinks, setShowEndedLinks] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [clientToRevoke, setClientToRevoke] = useState<ManagerClient | null>(
    null,
  );

  const pagination = usePagination({
    initialItemsPerPage: 10,
    initialSortBy: "name",
  });
  const { page, itemsPerPage, sortBy, order, setMeta, toggleSort, resetPage } =
    pagination;

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const {
    clients,
    meta,
    isLoading: isClientsLoading,
    error: clientsError,
    createLink,
    isCreating,
    revokeLink,
    isRevoking,
  } = useManagerClients({
    search: debouncedSearch || undefined,
    page,
    itemsPerPage,
    sortBy: sortBy as ClientSortBy,
    order,
    scope,
    activeOnly: isPlatformWide ? undefined : !showEndedLinks,
  });

  const handleQuickAddClient = async (investorId: number) => {
    await createLink({ investorId, managerId: user?.id });
  };

  useEffect(() => {
    if (meta) setMeta(meta);
  }, [meta, setMeta]);

  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, scope, showEndedLinks]);

  useEffect(() => {
    if (clientsError) {
      toast.error(resolveErrorMessage(clientsError, "clients.table.loadError"));
    }
  }, [clientsError]);

  const locale = i18n.resolvedLanguage || "pt-BR";
  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString(locale) : "—";

  const toDisplayCents = (cents: number) =>
    currency === "BRL" ? cents : Math.round(cents / usdToBrlRate);

  return (
    <section>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Input
          placeholder={t("clients.search")}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        {!isPlatformWide && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-ended-links"
              checked={showEndedLinks}
              onCheckedChange={(checked) => setShowEndedLinks(checked === true)}
            />
            <Label
              htmlFor="show-ended-links"
              className="text-sm font-normal cursor-pointer"
            >
              {t("clients.showEndedLinks")}
            </Label>
          </div>
        )}
      </div>

      {isClientsLoading && !clients.length ? (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      ) : clients.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {t("clients.table.empty")}
        </p>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    label={t("clients.table.name")}
                    sortKey="name"
                    currentSortBy={sortBy}
                    currentOrder={order}
                    onSort={toggleSort}
                  />
                  <SortableTableHead
                    label={t("clients.table.linkedAt")}
                    sortKey="activatedAt"
                    currentSortBy={sortBy}
                    currentOrder={order}
                    onSort={toggleSort}
                  />
                  <TableHead>{t("clients.table.riskProfile")}</TableHead>
                  <TableHead>
                    {isPlatformWide
                      ? t("clients.table.managers")
                      : t("clients.table.status")}
                  </TableHead>
                  <SortableTableHead
                    label={t("clients.table.wealth")}
                    sortKey="wealth"
                    currentSortBy={sortBy}
                    currentOrder={order}
                    onSort={toggleSort}
                  />
                  <SortableTableHead
                    label={t("clients.adherence.label")}
                    sortKey="adherenceIndex"
                    currentSortBy={sortBy}
                    currentOrder={order}
                    onSort={toggleSort}
                  />
                  <SortableTableHead
                    label={t("clients.variation.label")}
                    sortKey="monthlyVariation"
                    currentSortBy={sortBy}
                    currentOrder={order}
                    onSort={toggleSort}
                  />
                  <TableHead>{t("clients.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.investorId}>
                    <TableCell>
                      <p className="font-medium">{client.investorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {client.investorEmail}
                      </p>
                    </TableCell>
                    <TableCell>{formatDate(client.activatedAt)}</TableCell>
                    <TableCell>
                      <RiskProfileBadge riskProfile={client.riskProfile} />
                    </TableCell>
                    <TableCell>
                      {isPlatformWide ? (
                        client.managers && client.managers.length > 0 ? (
                          client.managers.map((m) => m.name).join(", ")
                        ) : (
                          "—"
                        )
                      ) : client.linkStatus ? (
                        <LinkStatusBadge status={client.linkStatus} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {formatCentsToCurrency(
                        toDisplayCents(client.currentWealthCents),
                        currency,
                      )}
                    </TableCell>
                    <TableCell
                      className={getAdherenceColor(client.adherenceIndexPp)}
                      title={
                        client.adherenceIndexPp === null
                          ? t("clients.adherence.tooltipNoData")
                          : undefined
                      }
                    >
                      {formatAdherence(client.adherenceIndexPp)}
                    </TableCell>
                    <TableCell
                      className={getVariationColor(client.monthlyVariationPct)}
                      title={
                        client.monthlyVariationPct === null
                          ? t("clients.variation.tooltipNoData")
                          : undefined
                      }
                    >
                      {formatVariation(client.monthlyVariationPct)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/manager/clients/${client.investorId}/dashboard`,
                            )
                          }
                        >
                          {t("clients.table.viewPortfolio")}
                        </Button>
                        {client.linkStatus === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setClientToRevoke(client)}
                          >
                            {t("clients.table.endLink")}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleQuickAddClient(client.investorId)
                            }
                            disabled={isCreating}
                          >
                            {t("clients.addClient")}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationControls
            pagination={pagination}
            itemsPerPageOptions={CLIENTS_ITEMS_PER_PAGE_OPTIONS}
          />
        </Card>
      )}

      <Dialog
        open={!!clientToRevoke}
        onOpenChange={(open) => {
          if (!open) setClientToRevoke(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("clients.confirmRevoke.title")}</DialogTitle>
            <DialogDescription>
              {t("clients.confirmRevoke.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClientToRevoke(null)}>
              {t("clients.confirmRevoke.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (clientToRevoke?.linkId) {
                  await revokeLink(clientToRevoke.linkId);
                  setClientToRevoke(null);
                }
              }}
              disabled={isRevoking}
            >
              {t("clients.confirmRevoke.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
