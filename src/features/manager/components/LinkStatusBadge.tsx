import { Badge } from "@/shared/components/ui/badge";
import { LinkStatus } from "@/shared/types/manager";
import { useTranslation } from "react-i18next";

interface LinkStatusBadgeProps {
  status: LinkStatus;
}

const statusVariant: Record<
  LinkStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  active: "default",
  rejected: "destructive",
  revoked: "secondary",
};

const statusClass: Record<LinkStatus, string> = {
  pending: "text-yellow-700 border-yellow-400 bg-yellow-50",
  active: "bg-green-600 text-white",
  rejected: "",
  revoked: "",
};

export const LinkStatusBadge = ({ status }: LinkStatusBadgeProps) => {
  const { t } = useTranslation();

  return (
    <Badge
      variant={statusVariant[status]}
      className={statusClass[status]}
    >
      {t(`linkStatus.${status}`)}
    </Badge>
  );
};
