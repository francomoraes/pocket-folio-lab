import { TFunction } from "i18next";
import { OperationLogEntry } from "@/shared/types/operationLog";
import { formatCentsToCurrency } from "@/shared/utils/formatters";

// Formata o "diff" de uma entrada (seção 6.2 de
// .docs/historico-de-operacoes.md) — cada campo presente em beforeValue ou
// afterValue vira um pedaço do texto, todos os pedaços encontrados são
// concatenados (não só o primeiro que bater), já que uma mesma entrada pode
// mudar mais de um campo de uma vez (ex.: nome + %meta no mesmo diálogo).
export function formatOperationLogDiff(
  entry: OperationLogEntry,
  t: TFunction,
): string {
  const before = entry.beforeValue ?? {};
  const after = entry.afterValue ?? {};
  const parts: string[] = [];

  if (
    typeof after.targetPercentage === "number" ||
    typeof before.targetPercentage === "number"
  ) {
    const assetTypeName =
      (after.assetTypeName as string | undefined) ??
      (before.assetTypeName as string | undefined);
    const beforePct =
      typeof before.targetPercentage === "number"
        ? `${(before.targetPercentage * 100).toFixed(1)}%`
        : null;
    const afterPct =
      typeof after.targetPercentage === "number"
        ? `${(after.targetPercentage * 100).toFixed(1)}%`
        : null;
    const pctChange =
      beforePct && afterPct && beforePct !== afterPct
        ? `${beforePct} → ${afterPct}`
        : (afterPct ?? beforePct);
    if (pctChange) {
      parts.push(assetTypeName ? `${assetTypeName}: ${pctChange}` : pctChange);
    }
  }

  if (typeof after.name === "string" || typeof before.name === "string") {
    const beforeName = before.name as string | undefined;
    const afterName = after.name as string | undefined;
    if (afterName && beforeName && afterName !== beforeName) {
      parts.push(`"${beforeName}" → "${afterName}"`);
    } else if (afterName) {
      parts.push(`"${afterName}"`);
    } else if (beforeName) {
      parts.push(`"${beforeName}"`);
    }
  }

  if (typeof after.riskProfile === "string") {
    parts.push(t(`riskProfile.${after.riskProfile}`));
  }

  if (
    typeof after.totalWealthCents === "number" ||
    typeof before.totalWealthCents === "number"
  ) {
    const beforeWealth =
      typeof before.totalWealthCents === "number"
        ? formatCentsToCurrency(before.totalWealthCents, "BRL")
        : null;
    const afterWealth =
      typeof after.totalWealthCents === "number"
        ? formatCentsToCurrency(after.totalWealthCents, "BRL")
        : null;
    if (beforeWealth && afterWealth && beforeWealth !== afterWealth) {
      parts.push(`${beforeWealth} → ${afterWealth}`);
    } else {
      parts.push(afterWealth ?? beforeWealth!);
    }
  }

  if (typeof after.managerId === "number") {
    parts.push(`#${after.managerId}`);
  } else if (typeof before.managerId === "number") {
    parts.push(`#${before.managerId}`);
  }

  return parts.join("; ");
}
