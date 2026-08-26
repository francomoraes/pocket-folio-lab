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
import { User, ArrowLeft } from "lucide-react";
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
      toast.success(t("managerContext.riskProfile.updated"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "common.status.error"));
    },
  });

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1 rounded-md transition-colors ${
      isActive
        ? "bg-amber-700/20 text-amber-900 font-semibold"
        : "hover:bg-amber-700/10 text-amber-800"
    }`;

  return (
    <div className="sticky top-[61px] z-40 bg-amber-50 border-b border-amber-200 shadow-sm">
      <div className="px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <User className="h-4 w-4 text-amber-600 shrink-0" />
          <span className="text-sm text-amber-700 whitespace-nowrap">
            {t("managerContext.viewing")}
          </span>
          {clientOptions.length > 0 ? (
            <Select value={String(investorId)} onValueChange={handleClientChange}>
              <SelectTrigger className="h-7 w-auto min-w-[140px] border-amber-300 bg-amber-100/50 text-sm font-semibold text-amber-900">
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
            <span className="text-sm font-semibold text-amber-900 truncate">
              {investorName}
            </span>
          )}

          {isAdmin && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setScope("mine")}
                className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                  scope === "mine"
                    ? "bg-amber-700/20 text-amber-900 font-semibold"
                    : "text-amber-700 hover:bg-amber-700/10"
                }`}
              >
                {t("managerContext.scope.mine")}
              </button>
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                  scope === "all"
                    ? "bg-amber-700/20 text-amber-900 font-semibold"
                    : "text-amber-700 hover:bg-amber-700/10"
                }`}
              >
                {t("managerContext.scope.all")}
              </button>
            </div>
          )}
        </div>

        <nav className="flex items-center gap-1">
          <NavLink
            to={`/manager/clients/${investorId}/dashboard`}
            className={navLinkClass}
          >
            {t("managerContext.nav.dashboard")}
          </NavLink>
          <NavLink
            to={`/manager/clients/${investorId}/positions`}
            className={navLinkClass}
          >
            {t("managerContext.nav.positions")}
          </NavLink>
          <NavLink
            to={`/manager/clients/${investorId}/targets`}
            className={navLinkClass}
          >
            {t("managerContext.nav.targets")}
          </NavLink>
          <NavLink
            to={`/manager/clients/${investorId}/settings`}
            className={navLinkClass}
          >
            {t("managerContext.nav.settings")}
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-amber-700 whitespace-nowrap">
            {t("managerContext.autonomy.label")}
          </span>
          <Switch
            checked={profile?.user.selfServiceEnabled ?? false}
            disabled={autonomyMutation.isPending}
            onCheckedChange={(checked) => autonomyMutation.mutate(checked)}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-amber-700 whitespace-nowrap">
            {t("managerContext.riskProfile.label")}
          </span>
          <Select
            value={profile?.user.riskProfile ?? undefined}
            disabled={riskProfileMutation.isPending}
            onValueChange={(value) =>
              riskProfileMutation.mutate(value as RiskProfile)
            }
          >
            <SelectTrigger className="h-7 w-auto min-w-[140px] border-amber-300 bg-amber-100/50 text-sm font-semibold text-amber-900">
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

        <Button
          variant="ghost"
          size="sm"
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 shrink-0"
          onClick={() => navigate("/manager/clients")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("managerContext.exitContext")}
        </Button>
      </div>
    </div>
  );
};
