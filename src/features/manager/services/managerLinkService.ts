import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { ManagerClientLink, ManagerHistoryCycle, PendingApproval, SentRequest } from "@/shared/types/manager";

class ManagerLinkService {
  async createLink(
    targetUserId: number,
    asRole: "investor" | "manager",
  ): Promise<ManagerClientLink> {
    const response = await api.post<{ link: ManagerClientLink }>(
      API_ENDPOINTS.managerLinks.create,
      { targetUserId, asRole },
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

  async getPendingApprovals(): Promise<PendingApproval[]> {
    const response = await api.get<{ data: PendingApproval[] }>(
      API_ENDPOINTS.managerLinks.pending,
    );
    return response.data.data;
  }

  async getSentRequests(): Promise<SentRequest[]> {
    const response = await api.get<{ data: SentRequest[] }>(
      API_ENDPOINTS.managerLinks.sent,
    );
    return response.data.data;
  }

  async approveLink(linkId: number): Promise<ManagerClientLink> {
    const response = await api.patch<{ link: ManagerClientLink }>(
      API_ENDPOINTS.managerLinks.approve(linkId),
    );
    return response.data.link;
  }

  async rejectLink(linkId: number): Promise<ManagerClientLink> {
    const response = await api.patch<{ link: ManagerClientLink }>(
      API_ENDPOINTS.managerLinks.reject(linkId),
    );
    return response.data.link;
  }

  async revokeLink(linkId: number): Promise<ManagerClientLink> {
    const response = await api.patch<{ link: ManagerClientLink }>(
      API_ENDPOINTS.managerLinks.revoke(linkId),
    );
    return response.data.link;
  }
}

export const managerLinkService = new ManagerLinkService();
