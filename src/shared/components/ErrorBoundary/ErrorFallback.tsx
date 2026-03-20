import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "react-i18next";

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">😵</div>

        <h2 className="text-2xl font-bold">{t("common.status.error")}</h2>

        <p className="text-muted-foreground">{t("global.errors.unexpected")}</p>

        {process.env.NODE_ENV === "development" && error && (
          <details className="text-left text-xs bg-muted p-4 rounded">
            <summary className="cursor-pointer font-semibold mb-2">
              {t("global.errors.technicalDetails")}
            </summary>
            <pre className="overflow-auto">
              {error.message}
              {"\n\n"}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex gap-2 justify-center">
          <Button onClick={() => window.location.reload()}>
            {t("common.buttons.reloadPage")}
          </Button>

          {resetError && (
            <Button variant="outline" onClick={resetError}>
              {t("common.buttons.tryAgain")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
