import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { User, ArrowLeft, Menu } from "lucide-react";
import { RiskProfile } from "@/shared/types/riskProfile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useAuth } from "@/shared/hooks/useAuth";
import { useManagerClients } from "@/features/manager/hooks/useManagerClients";
import { useAvailableInvestors } from "@/features/manager/hooks/useAvailableInvestors";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useState } from "react";

interface ManagerContextBannerProps {
  investorId: number;
}

export const ManagerContextBanner = ({
  investorId,
}: ManagerContextBannerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [scope, setScope] = useState<"mine" | "all">("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: QUERY_KEYS.clientProfile(investorId),
    queryFn: () => managerService.getClientProfile(investorId),
    enabled: !!investorId,
    staleTime: 5 * 60 * 1000,
  });

  const investorName = profile?.user.name ?? `#${investorId}`;

  const { clients: managerClients } = useManagerClients();
  const { investors: availableInvestors } = useAvailableInvestors();

  const clientOptions =
    isAdmin && scope === "all"
      ? availableInvestors.map((investor) => ({
          id: investor.id,
          name: investor.name,
        }))
      : managerClients.map((client) => ({
          id: client.investorId,
          name: client.investorName,
        }));

  const currentSection = location.pathname.split("/").pop();

  const handleClientChange = (value: string) => {
    const newInvestorId = Number(value);
    navigate(`/manager/clients/${newInvestorId}/${currentSection}`);
  };

  const autonomyMutation = useMutation({
    mutationFn: (enabled: boolean) =>
      managerService.updateClientAutonomy(investorId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clientProfile(investorId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clientOperationLogs(investorId),
      });
      toast.success(t("managerContext.autonomy.updated"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "common.status.error"));
    },
  });

  const riskProfileMutation = useMutation({
    mutationFn: (riskProfile: RiskProfile) =>
      managerService.updateClientRiskProfile(investorId, riskProfile),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clientProfile(investorId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clientOperationLogs(investorId),
      });
      toast.success(t("managerContext.riskProfile.updated"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "common.status.error"));
    },
  });

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1 rounded-md transition-colors ${
      isActive
        ? "bg-warning/20 text-foreground font-semibold"
        : "hover:bg-warning/10 text-muted-foreground"
    }`;

  const scopeToggle = isAdmin && (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={() => setScope("mine")}
        className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
          scope === "mine"
            ? "bg-warning/20 text-foreground font-semibold"
            : "text-muted-foreground hover:bg-warning/10"
        }`}
      >
        {t("managerContext.scope.mine")}
      </button>
      <button
        type="button"
        onClick={() => setScope("all")}
        className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
          scope === "all"
            ? "bg-warning/20 text-foreground font-semibold"
            : "text-muted-foreground hover:bg-warning/10"
        }`}
      >
        {t("managerContext.scope.all")}
      </button>
    </div>
  );

  const navLinks = (stacked: boolean, onNavigate?: () => void) => (
    <nav
      className={`flex items-center gap-1 ${stacked ? "flex-col items-stretch" : ""}`}
    >
      <NavLink
        to={`/manager/clients/${investorId}/dashboard`}
        className={navLinkClass}
        onClick={onNavigate}
      >
        {t("managerContext.nav.dashboard")}
      </NavLink>
      <NavLink
        to={`/manager/clients/${investorId}/positions`}
        className={navLinkClass}
        onClick={onNavigate}
      >
        {t("managerContext.nav.positions")}
      </NavLink>
      <NavLink
        to={`/manager/clients/${investorId}/targets`}
        className={navLinkClass}
        onClick={onNavigate}
      >
        {t("managerContext.nav.targets")}
      </NavLink>
      <NavLink
        to={`/manager/clients/${investorId}/settings`}
        className={navLinkClass}
        onClick={onNavigate}
      >
        {t("managerContext.nav.settings")}
      </NavLink>
      <NavLink
        to={`/manager/clients/${investorId}/history`}
        className={navLinkClass}
        onClick={onNavigate}
      >
        {t("managerContext.nav.history")}
      </NavLink>
    </nav>
  );

  const autonomyControl = (
    <div className="flex items-center gap-2 shrink-0 justify-between">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {t("managerContext.autonomy.label")}
      </span>
      <Switch
        checked={profile?.user.selfServiceEnabled ?? false}
        disabled={autonomyMutation.isPending}
        onCheckedChange={(checked) => autonomyMutation.mutate(checked)}
      />
    </div>
  );

  const riskProfileControl = (
    <div className="flex items-center gap-2 shrink-0 justify-between">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {t("managerContext.riskProfile.label")}
      </span>
      <Select
        value={profile?.user.riskProfile ?? undefined}
        disabled={riskProfileMutation.isPending}
        onValueChange={(value) =>
          riskProfileMutation.mutate(value as RiskProfile)
        }
      >
        <SelectTrigger className="h-7 w-auto min-w-[140px] border-warning/40 bg-warning/15 text-sm font-semibold text-foreground">
          <SelectValue
            placeholder={t("managerContext.riskProfile.placeholder")}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="conservative">
            {t("riskProfile.conservative")}
          </SelectItem>
          <SelectItem value="moderate">
            {t("riskProfile.moderate")}
          </SelectItem>
          <SelectItem value="aggressive">
            {t("riskProfile.aggressive")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="sticky top-[61px] z-40 bg-warning/30 backdrop-blur-md supports-[backdrop-filter]:bg-warning/15 border-b border-warning/30 shadow-sm">
      <div className="px-4 py-2 flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <User className="h-4 w-4 text-warning shrink-0" />
          {clientOptions.length > 0 ? (
            <Select value={String(investorId)} onValueChange={handleClientChange}>
              <SelectTrigger className="h-7 w-auto min-w-[140px] border-warning/40 bg-warning/15 text-sm font-semibold text-foreground">
                <SelectValue placeholder={investorName} />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-sm font-semibold text-foreground truncate">
              {investorName}
            </span>
          )}

          {scopeToggle}
        </div>

        <div className="hidden min-[1320px]:flex items-center gap-4">
          {navLinks(false)}
          {autonomyControl}
          {riskProfileControl}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-warning/10 shrink-0"
              onClick={() => navigate("/manager/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">
                {t("managerContext.exitContext")}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            {t("managerContext.exitContext")}
          </TooltipContent>
        </Tooltip>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="min-[1320px]:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground hover:bg-warning/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle>{t("managerContext.menuTitle")}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 mt-6">
              {navLinks(true, () => setIsSheetOpen(false))}
              {autonomyControl}
              {riskProfileControl}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
