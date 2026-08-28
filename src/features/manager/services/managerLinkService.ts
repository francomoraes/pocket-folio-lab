import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { ManagerClientLink, ManagerHistoryCycle } from "@/shared/types/manager";

class ManagerLinkService {
  async createLink(
    investorId: number,
    managerId?: number,
  ): Promise<ManagerClientLink> {
    const response = await api.post<{ link: ManagerClientLink }>(
      API_ENDPOINTS.managerLinks.create,
      { investorId, managerId },
    );
    return response.data.link;
  }

  async getMyLinks(): Promise<ManagerClientLink[]> {
    const response = await api.get<{ data: ManagerClientLink[] }>(
      API_ENDPOINTS.managerLinks.myLinks,
    );
    return response.data.data;
  }

  async getMyHistory(): Promise<ManagerHistoryCycle[]> {
    const response = await api.get<{ data: ManagerHistoryCycle[] }>(
      API_ENDPOINTS.managerLinks.myHistory,
    );
    return response.data.data;
  }

  async revokeLink(linkId: number): Promise<ManagerClientLink> {
    const response = await api.patch<{ link: ManagerClientLink }>(
      API_ENDPOINTS.managerLinks.revoke(linkId),
    );
    return response.data.link;
  }
}

export const managerLinkService = new ManagerLinkService();
