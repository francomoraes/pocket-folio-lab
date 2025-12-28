export default {
  title: "Minhas Posições",
  subtitle: "Gerencie sua carteira de investimentos",
  actions: {
    newTransaction: "Nova Transação",
    refreshPrices: "Atualizar Cotações",
    uploadCsv: "Importar CSV",
    downloadCsv: "Baixar CSV",
  },
  summary: {
    patrimonyUSD: "Patromônio (parte em dólares)",
    patrimonyBRL: "Patromônio (parte em reais)",
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
    },
    empty: "Nenhuma posição encontrada. Adicione uma transação para começar.",
  },
};
