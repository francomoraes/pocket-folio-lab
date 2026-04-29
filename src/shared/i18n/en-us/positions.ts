export default {
  title: "My Positions",
  subtitle: "Manage your investment portfolio",
  actions: {
    addAsset: "Add Asset",
    refreshPrices: "Refresh Prices",
    uploadCsv: "Import CSV",
    downloadCsv: "Download CSV",
  },
  summary: {
    patrimonyUSD: "Net Worth (USD portion)",
    patrimonyBRL: "Net Worth (BRL portion)",
    consolidatedPatrimony: "Consolidated Net Worth",
    patrimony: "Net Worth",
    currencyTitles: {
      brl: "Brazilian Real",
      usd: "US Dollar",
    },
  },
  tabs: {
    variableIncome: "Variable Income",
    fixedIncome: "Fixed Income",
  },
  table: {
    headers: {
      ticker: "Ticker",
      type: "Type",
      quantity: "Quantity",
      averagePrice: "Avg. Price",
      currentPrice: "Price",
      total: "Total",
      profitLoss: "P/L",
      institution: "Institution",
      portfolioPercentage: "% Portfolio",
      description: "Description",
      startDate: "Start Date",
      maturityDate: "Maturity",
      indexation: "Indexation",
      invested: "Invested",
      currentValue: "Current Value",
      result: "Result",
      return: "Return",
      actions: "Actions",
    },
    empty: "No positions found. Add an asset to get started.",
    priceUnavailable: "N/A",
    priceUnavailableTooltip:
      "Price unavailable. Edit the asset to set it manually. Last attempt: {{date}}",
  },
  fixedIncome: {
    indexation: {
      pre: "{{rate}}% p.a.",
      cdi: "CDI + {{rate}}%",
      ipca: "IPCA + {{rate}}%",
      selic: "Selic + {{rate}}%",
      default: "{{rate}}%",
    },
  },
};
