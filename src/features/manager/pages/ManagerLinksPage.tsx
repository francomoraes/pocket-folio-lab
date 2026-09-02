import { useMyLinkHistory } from "@/features/manager/hooks/useMyLinkHistory";
import { LinkHistoryTable } from "@/features/manager/components/LinkHistoryTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";

export const ManagerLinksPage = () => {
  const { t } = useTranslation();
  const { history, isLoading: isLoadingHistory } = useMyLinkHistory();

  return (
    <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">{t("managers.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("managers.subtitle")}
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="history">
        <AccordionItem value="history" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="font-semibold">{t("managers.history.title")}</span>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <Card className="rounded-none border-t">
              <LinkHistoryTable history={history} isLoading={isLoadingHistory} />
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
