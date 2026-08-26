import { ManagerClientLink } from "@/shared/types/manager";
import { LinkStatusBadge } from "./LinkStatusBadge";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";

interface ManagerLinkCardProps {
  link: ManagerClientLink;
}

export const ManagerLinkCard = ({ link }: ManagerLinkCardProps) => {
  const { t, i18n } = useTranslation();

  const locale = i18n.resolvedLanguage || "pt-BR";
  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString(locale) : "—";

  return (
    <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{link.managerName}</span>
          <LinkStatusBadge status={link.status} />
        </div>
        <p className="text-sm text-muted-foreground">{link.managerEmail}</p>
        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
          <span>
            {t("managers.linkInfo.requestedAt")}: {fmt(link.createdAt)}
          </span>
          {link.activatedAt && (
            <span>
              {t("managers.linkInfo.activatedAt")}: {fmt(link.activatedAt)}
            </span>
          )}
          {link.rejectedAt && (
            <span>
              {t("managers.linkInfo.rejectedAt")}: {fmt(link.rejectedAt)}
            </span>
          )}
          {link.revokedAt && (
            <span>
              {link.activatedAt
                ? t("managers.linkInfo.revokedAt")
                : t("managers.linkInfo.cancelledAt")}
              : {fmt(link.revokedAt)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
