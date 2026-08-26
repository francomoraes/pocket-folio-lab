import { useManagerClients } from "@/features/manager/hooks/useManagerClients";
import { ClientCard } from "@/features/manager/components/ClientCard";
import { AvailableInvestorsList } from "@/features/manager/components/AvailableInvestorsList";
import { CreateUserDialog } from "@/features/users/components/CreateUserDialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@/shared/components/ui/circular-progress";
import { Plus } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";

export const ManagerClientsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [scope, setScope] = useState<"mine" | "all">("mine");

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const {
    clients,
    isLoading,
    createLink,
    isCreating,
    revokeLink,
    isRevoking,
  } = useManagerClients({
    search: debouncedSearch || undefined,
    page: 1,
    itemsPerPage: 50,
    sortBy: "name",
    order: "ASC",
  });

  const handleAddClient = async (investorId: number, managerId?: number) => {
    await createLink({ investorId, managerId });
    setSheetOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("clients.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("clients.subtitle")}</p>
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

      {isAdmin && scope === "all" ? (
        <section>
          <AvailableInvestorsList
            onView={(investorId) =>
              navigate(`/manager/clients/${investorId}/dashboard`)
            }
          />
        </section>
      ) : (
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
      )}
    </div>
  );
};
