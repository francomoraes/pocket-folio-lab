import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useManagerDashboard } from "@/features/manager/hooks/useManagerDashboard";
import { managerLinkService } from "@/features/manager/services/managerLinkService";
import { ManagerDashboardStats } from "@/features/manager/components/ManagerDashboardStats";
import { ClientsListSection } from "@/features/manager/components/ClientsListSection";
import { AvailableInvestorsList } from "@/features/manager/components/AvailableInvestorsList";
import { CreateUserDialog } from "@/features/users/components/CreateUserDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import CircularProgress from "@/shared/components/ui/circular-progress";
import { useAuth } from "@/shared/hooks/useAuth";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { Plus } from "lucide-react";

export const ManagerDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const { dashboard, isLoading: isDashboardLoading } = useManagerDashboard();
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const createLinkMutation = useMutation({
    mutationFn: ({
      investorId,
      managerId,
    }: {
      investorId: number;
      managerId?: number;
    }) => managerLinkService.createLink(investorId, managerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.managerClientsRoot });
      toast.success(t("clients.clientAdded"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "clients.addClientError"));
    },
  });

  const handleAddClient = async (investorId: number, managerId?: number) => {
    await createLinkMutation.mutateAsync({ investorId, managerId });
    setSheetOpen(false);
  };

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
                  isRequesting={createLinkMutation.isPending}
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

      {isDashboardLoading ? (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      ) : !dashboard ? (
        <p className="text-muted-foreground">{t("managerDashboard.empty")}</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <ManagerDashboardStats
            dashboard={dashboard}
            currency={currency}
            onCurrencyChange={setCurrency}
          />
        </div>
      )}

      <ClientsListSection
        scope="mine"
        currency={currency}
        usdToBrlRate={dashboard?.exchangeRate?.usdToBrl || 5.7}
      />
    </div>
  );
};
