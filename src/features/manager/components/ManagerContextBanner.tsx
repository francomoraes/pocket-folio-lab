import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { User, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

interface ManagerContextBannerProps {
  investorId: number;
}

export const ManagerContextBanner = ({
  investorId,
}: ManagerContextBannerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: QUERY_KEYS.clientProfile(investorId),
    queryFn: () => managerService.getClientProfile(investorId),
    enabled: !!investorId,
    staleTime: 5 * 60 * 1000,
  });

  const investorName = profile?.user.name ?? `#${investorId}`;

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
          <span className="text-sm font-semibold text-amber-900 truncate">
            {investorName}
          </span>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink
            to={`/manager/clients/${investorId}/targets`}
            className={navLinkClass}
          >
            {t("managerContext.nav.targets")}
          </NavLink>
          <NavLink
            to={`/manager/clients/${investorId}/positions`}
            className={navLinkClass}
          >
            {t("managerContext.nav.positions")}
          </NavLink>
        </nav>

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
