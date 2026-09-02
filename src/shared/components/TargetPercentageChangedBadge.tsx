import { useTranslation } from "react-i18next";
import { RotateCw } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { RecentTargetPercentageChange } from "@/shared/hooks/useRecentTargetPercentageChanges";

interface TargetPercentageChangedBadgeProps {
  change?: RecentTargetPercentageChange;
}

export const TargetPercentageChangedBadge = ({
  change,
}: TargetPercentageChangedBadgeProps) => {
  const { t, i18n } = useTranslation();

  if (!change) return null;

  const locale = i18n.resolvedLanguage || "pt-BR";
  const dateLabel = new Date(change.createdAt).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
  });

  const tooltip =
    change.beforeTargetPercentage !== null
      ? t("history.badge.tooltip", {
          before: (change.beforeTargetPercentage * 100).toFixed(1),
          after: (change.afterTargetPercentage! * 100).toFixed(1),
          actor: change.actorEmail,
        })
      : t("history.badge.tooltipNoBefore", {
          after: (change.afterTargetPercentage! * 100).toFixed(1),
          actor: change.actorEmail,
        });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="gap-1 text-amber-700 border-amber-300 bg-amber-50 cursor-help"
        >
          <RotateCw className="h-3 w-3" />
          {t("history.badge.changed", { date: dateLabel })}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};
