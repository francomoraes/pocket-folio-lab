import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import {
  AssetTransaction,
  AssetTransactionListParams,
  CreateAssetTransactionRequest,
  UpdateAssetTransactionRequest,
} from "@/shared/types/assetTransaction";
import { PaginatedResponse } from "@/shared/types/asset";

class AssetTransactionService {
  async getTransactions(
    params: AssetTransactionListParams = {},
  ): Promise<PaginatedResponse<AssetTransaction>> {
    const response = await api.get<PaginatedResponse<AssetTransaction>>(
      API_ENDPOINTS.assetTransactions.list,
      { params },
    );
    return response.data;
  }

  async createTransaction(
    data: CreateAssetTransactionRequest,
  ): Promise<AssetTransaction> {
    const response = await api.post<{ transaction: AssetTransaction }>(
      API_ENDPOINTS.assetTransactions.create,
      data,
    );
    return response.data.transaction;
  }

  async updateTransaction(
    transactionId: number,
    data: UpdateAssetTransactionRequest,
  ): Promise<AssetTransaction> {
    const url = API_ENDPOINTS.assetTransactions.update.replace(
      ":transactionId",
      transactionId.toString(),
    );
    const response = await api.put<{ transaction: AssetTransaction }>(url, data);
    return response.data.transaction;
  }

  async deleteTransaction(transactionId: number): Promise<void> {
    const url = API_ENDPOINTS.assetTransactions.delete.replace(
      ":transactionId",
      transactionId.toString(),
    );
    await api.delete<void>(url);
  }
}

export const assetTransactionService = new AssetTransactionService();
