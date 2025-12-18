import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { Institution, CreateInstitution } from "@/shared/types/institution";

class InstitutionService {
  async list(): Promise<Institution[]> {
    const response = await api.get<Institution[]>(
      API_ENDPOINTS.institutions.list,
    );
    return response.data;
  }

  async getById(id: number): Promise<Institution> {
    const url = API_ENDPOINTS.institutions.get.replace(":id", id.toString());
    const response = await api.get<Institution>(url);
    return response.data;
  }

  async create(data: CreateInstitution): Promise<Institution> {
    const response = await api.post<Institution>(
      API_ENDPOINTS.institutions.create,
      data,
    );
    return response.data;
  }

  async update(
    id: number,
    data: Partial<CreateInstitution>,
  ): Promise<Institution> {
    const url = API_ENDPOINTS.institutions.update.replace(":id", id.toString());
    const response = await api.patch<Institution>(url, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    const url = API_ENDPOINTS.institutions.delete.replace(":id", id.toString());
    await api.delete<void>(url);
  }
}

export const institutionService = new InstitutionService();
