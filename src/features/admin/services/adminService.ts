import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { AdminUser, PaginationMeta } from "@/shared/types/manager";
import { UserRole } from "@/shared/types/roles";

class AdminService {
  async listUsers(params: {
    search?: string;
    page?: number;
    itemsPerPage?: number;
  }): Promise<{ data: AdminUser[]; meta: PaginationMeta }> {
    const response = await api.get<{ data: AdminUser[]; meta: PaginationMeta }>(
      API_ENDPOINTS.admin.listUsers,
      { params },
    );
    return response.data;
  }

  async setUserRole(
    userId: number,
    role: UserRole,
  ): Promise<{ id: number; name: string; email: string; role: UserRole }> {
    const response = await api.patch<{
      user: { id: number; name: string; email: string; role: UserRole };
    }>(API_ENDPOINTS.admin.setRole(userId), { role });
    return response.data.user;
  }

  async setManagerClientLimit(
    managerId: number,
    limit: number,
  ): Promise<{ id: number; managerClientLimit: number }> {
    const response = await api.patch<{
      user: { id: number; managerClientLimit: number };
    }>(API_ENDPOINTS.admin.setClientLimit(managerId), { limit });
    return response.data.user;
  }
}

export const adminService = new AdminService();
