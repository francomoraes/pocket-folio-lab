import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  BarChart2,
  FileSpreadsheet,
  Globe2,
  PieChart,
  TrendingUp,
  ShieldCheck,
  WifiOff,
  FileX2,
} from "lucide-react";

const FEATURE_ICONS = [PieChart, FileSpreadsheet, Globe2, BarChart2] as const;

export const HomePage = () => {
  const { t } = useTranslation();

  const features = [
    { key: "portfolio", Icon: FEATURE_ICONS[0] },
    { key: "csv", Icon: FEATURE_ICONS[1] },
    { key: "multiCurrency", Icon: FEATURE_ICONS[2] },
    { key: "charts", Icon: FEATURE_ICONS[3] },
  ] as const;

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20 sm:py-32 gap-6">
        <div className="flex items-center gap-2 text-accent mb-2">
          <TrendingUp className="h-8 w-8" />
          <span className="text-2xl font-bold">Invest Tracker</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl">
          {t("home.hero.title")}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
          {t("home.hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button asChild size="lg" className="text-base px-8">
            <Link to="/login">{t("home.hero.ctaRegister")}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-base px-8"
          >
            <Link to="/login">{t("home.hero.ctaLogin")}</Link>
          </Button>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="px-4 py-16 bg-muted/40">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            {t("home.features.title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {features.map(({ key, Icon }) => (
              <Card key={key} className="border bg-background">
                <CardContent className="flex gap-4 items-start p-6">
                  <div className="mt-1 p-2 rounded-md bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-base">
                      {t(`home.features.${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`home.features.${key}.description`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security / trust */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-green-500/10">
              <ShieldCheck className="h-7 w-7 text-green-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {t("home.security.title")}
            </h2>
            <p className="text-muted-foreground max-w-xl">
              {t("home.security.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {(
              [
                {
                  key: "noCredentials",
                  Icon: ShieldCheck,
                  color: "text-green-500 bg-green-500/10",
                },
                {
                  key: "noIntegration",
                  Icon: WifiOff,
                  color: "text-blue-500  bg-blue-500/10",
                },
                {
                  key: "noIr",
                  Icon: FileX2,
                  color: "text-amber-500 bg-amber-500/10",
                },
              ] as const
            ).map(({ key, Icon, color }) => (
              <div
                key={key}
                className="flex flex-col gap-3 rounded-xl border bg-background p-6"
              >
                <div className={`w-fit p-2 rounded-md ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-base">
                  {t(`home.security.items.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`home.security.items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            {t("home.preview.title")}
          </h2>

          <div className="w-full rounded-xl border bg-muted/30 overflow-hidden shadow-lg">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-muted border-b">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">
                pocket-folio.app/positions
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 p-6">
              {[
                { label: "Total investido", value: "R$ 48.320,00" },
                { label: "Valor atual", value: "R$ 53.140,00" },
                { label: "Rentabilidade", value: "+9,97%" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border bg-background p-4 flex flex-col gap-1"
                >
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-lg font-bold">{value}</span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 flex flex-col gap-2">
              {[
                { ticker: "AAPL", pct: "24%", color: "bg-blue-500" },
                { ticker: "TRXF11", pct: "18%", color: "bg-green-500" },
                { ticker: "BTC-USD", pct: "12%", color: "bg-orange-500" },
                { ticker: "VNQ", pct: "8%", color: "bg-purple-500" },
              ].map(({ ticker, pct, color }) => (
                <div key={ticker} className="flex items-center gap-3">
                  <span className="text-xs font-mono w-16">{ticker}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: pct }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-12 bg-muted/40 text-center">
        <p className="text-muted-foreground mb-4">{t("home.hero.subtitle")}</p>
        <Button asChild size="lg">
          <Link to="/login">{t("home.hero.ctaRegister")}</Link>
        </Button>
      </section>
    </main>
  );
};
