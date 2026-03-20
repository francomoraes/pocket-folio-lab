export default {
  title: "Minhas Posições",
  subtitle: "Gerencie sua carteira de investimentos",
  actions: {
    addAsset: "Adicionar Ativo",
    refreshPrices: "Atualizar Cotações",
    uploadCsv: "Importar CSV",
    downloadCsv: "Baixar CSV",
  },
  summary: {
    patrimonyUSD: "Patromônio (parte em dólares)",
    patrimonyBRL: "Patromônio (parte em reais)",
    consolidatedPatrimony: "Patrimônio Consolidado",
  },
  table: {
    headers: {
      ticker: "Ticker",
      type: "Tipo",
      quantity: "Quantidade",
      averagePrice: "PM Compra",
      currentPrice: "Cotação",
      total: "Total",
      profitLoss: "L/P",
      institution: "Instituição",
      portfolioPercentage: "% Carteira",
      description: "Descrição",
    },
    empty: "Nenhuma posição encontrada. Adicione um ativo para começar.",
  },
};
