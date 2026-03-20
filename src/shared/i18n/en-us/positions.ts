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
    },
    empty: "No positions found. Add an asset to get started.",
  },
};
