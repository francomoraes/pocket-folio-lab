import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";

export interface ExchangeRateResponse {
  usdToBrl: number;
  updatedAt: string;
}

class ExchangeRateService {
  async getExchangeRate(): Promise<ExchangeRateResponse> {
    const response = await api.get<ExchangeRateResponse>(
      API_ENDPOINTS.exchangeRate.get,
    );
    return response.data;
  }
}

export const exchangeRateService = new ExchangeRateService();
