import { Badge } from "@/shared/components/ui/badge";
import { RiskProfile } from "@/shared/types/riskProfile";
import { useTranslation } from "react-i18next";

interface RiskProfileBadgeProps {
  riskProfile: RiskProfile | null;
}

const riskProfileClass: Record<RiskProfile, string> = {
  conservative: "bg-green-600 text-white",
  moderate: "text-yellow-700 border-yellow-400 bg-yellow-50",
  aggressive: "bg-red-600 text-white",
};

export const RiskProfileBadge = ({ riskProfile }: RiskProfileBadgeProps) => {
  const { t } = useTranslation();

  if (!riskProfile) {
    return <Badge variant="outline">{t("riskProfile.notDefined")}</Badge>;
  }

  return (
    <Badge variant="default" className={riskProfileClass[riskProfile]}>
      {t(`riskProfile.${riskProfile}`)}
    </Badge>
  );
};
