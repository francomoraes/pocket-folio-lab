import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useManagerDashboard } from "@/features/manager/hooks/useManagerDashboard";
import { useManagerClients } from "@/features/manager/hooks/useManagerClients";
import { ManagerDashboardStats } from "@/features/manager/components/ManagerDashboardStats";
import { AvailableInvestorsList } from "@/features/manager/components/AvailableInvestorsList";
import { LinkStatusBadge } from "@/features/manager/components/LinkStatusBadge";
import { CreateUserDialog } from "@/features/users/components/CreateUserDialog";
import { RiskProfileBadge } from "@/shared/components/RiskProfileBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
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
import { Plus } from "lucide-react";
import {
  formatAdherence,
  formatCentsToCurrency,
  formatVariation,
  getAdherenceColor,
  getVariationColor,
} from "@/shared/utils/formatters";
import {
  ClientScope,
  ClientSortBy,
  ManagerClient,
} from "@/shared/types/manager";

const STATS_ACCORDION_STORAGE_KEY = "manager-dashboard-stats-open";
const CLIENTS_ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

export const ManagerDashboardPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [scope, setScope] = useState<ClientScope>("mine");
  const [activeOnly, setActiveOnly] = useState(false);
  const { dashboard, isLoading: isDashboardLoading } = useManagerDashboard({
    scope: isAdmin ? scope : undefined,
  });

  const [statsOpen, setStatsOpen] = useState(
    () => localStorage.getItem(STATS_ACCORDION_STORAGE_KEY) !== "closed",
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [clientToRevoke, setClientToRevoke] = useState<ManagerClient | null>(
    null,
  );

  const pagination = usePagination({
    initialItemsPerPage: 10,
    initialSortBy: "name",
  });
  const {
    page,
    itemsPerPage,
    sortBy,
    order,
    setMeta,
    toggleSort,
    resetPage,
  } = pagination;

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
    scope: isAdmin ? scope : undefined,
    activeOnly,
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
  }, [debouncedSearch, scope, activeOnly]);

  useEffect(() => {
    if (clientsError) {
      toast.error(resolveErrorMessage(clientsError, "clients.table.loadError"));
    }
  }, [clientsError]);

  const toggleStatsOpen = (open: boolean) => {
    setStatsOpen(open);
    localStorage.setItem(STATS_ACCORDION_STORAGE_KEY, open ? "open" : "closed");
  };

  const handleAddClient = async (investorId: number, managerId?: number) => {
    await createLink({ investorId, managerId });
    setSheetOpen(false);
  };

  const locale = i18n.resolvedLanguage || "pt-BR";
  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString(locale) : "—";

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("managerDashboard.title")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("managerDashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("clients.createClient")}
          </Button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("clients.addClient")}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("clients.addClient")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <AvailableInvestorsList
                  onRequest={handleAddClient}
                  isRequesting={isCreating}
                  showManagerSelector={isAdmin}
                  onView={
                    isAdmin
                      ? (investorId) => {
                          setSheetOpen(false);
                          navigate(`/manager/clients/${investorId}/dashboard`);
                        }
                      : undefined
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        allowedRoles={["investor"]}
      />

      {isAdmin && (
        <div className="flex items-center gap-2">
          <Button
            variant={scope === "mine" ? "default" : "outline"}
            size="sm"
            onClick={() => setScope("mine")}
          >
            {t("clients.scope.mine")}
          </Button>
          <Button
            variant={scope === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setScope("all")}
          >
            {t("clients.scope.all")}
          </Button>
        </div>
      )}

      {isDashboardLoading ? (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      ) : !dashboard ? (
        <p className="text-muted-foreground">{t("managerDashboard.empty")}</p>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={statsOpen ? "stats" : ""}
          onValueChange={(value) => toggleStatsOpen(value === "stats")}
        >
          <AccordionItem value="stats" className="border-none">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              {t("managerDashboard.sections.stats")}
            </AccordionTrigger>
            <AccordionContent>
              <ManagerDashboardStats dashboard={dashboard} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <section>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Input
            placeholder={t("clients.search")}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="active-only"
              checked={activeOnly}
              onCheckedChange={(checked) => setActiveOnly(checked === true)}
            />
            <Label htmlFor="active-only" className="text-sm font-normal cursor-pointer">
              {t("clients.activeOnly")}
            </Label>
          </div>
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
                    <TableHead>{t("clients.table.status")}</TableHead>
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
                        {client.linkStatus ? (
                          <LinkStatusBadge status={client.linkStatus} />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {formatCentsToCurrency(
                          client.currentWealthCents,
                          "BRL",
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
                        className={getVariationColor(
                          client.monthlyVariationPct,
                        )}
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
      </section>

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
    </div>
  );
};
