import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import {
  ConnectCryptoAccountRequest,
  CryptoAccount,
} from "@/shared/types/cryptoAccount";

class CryptoAccountService {
  async list(): Promise<CryptoAccount[]> {
    const response = await api.get<CryptoAccount[]>(
      API_ENDPOINTS.cryptoAccounts.list,
    );
    return response.data;
  }

  async connect(data: ConnectCryptoAccountRequest): Promise<CryptoAccount> {
    const response = await api.post<{ message: string; account: CryptoAccount }>(
      API_ENDPOINTS.cryptoAccounts.create,
      data,
    );
    return response.data.account;
  }

  async sync(id: number): Promise<CryptoAccount> {
    const url = API_ENDPOINTS.cryptoAccounts.sync.replace(":id", id.toString());
    const response = await api.post<{ message: string; account: CryptoAccount }>(
      url,
    );
    return response.data.account;
  }

  async disconnect(id: number): Promise<void> {
    const url = API_ENDPOINTS.cryptoAccounts.delete.replace(
      ":id",
      id.toString(),
    );
    await api.delete<void>(url);
  }
}

export const cryptoAccountService = new CryptoAccountService();
