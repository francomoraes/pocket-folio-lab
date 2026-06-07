import { ManagerClientLink } from "@/shared/types/manager";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";

interface PendingLinkCardProps {
  link: ManagerClientLink;
  onApprove: (linkId: number) => Promise<void>;
  onReject: (linkId: number) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
}

export const PendingLinkCard = ({
  link,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: PendingLinkCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || "pt-BR";
  const fmt = (d: string) => new Date(d).toLocaleDateString(locale);

  return (
    <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium">{link.investorName}</p>
        <p className="text-sm text-muted-foreground">{link.investorEmail}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {fmt(link.createdAt)}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onApprove(link.id)}
          disabled={isApproving || isRejecting}
        >
          {t("clients.pending.accept")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(link.id)}
          disabled={isApproving || isRejecting}
        >
          {t("clients.pending.reject")}
        </Button>
      </div>
    </Card>
  );
};
