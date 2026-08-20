import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { UserRole } from "@/shared/types/roles";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreatedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

class UserService {
  async createUser(payload: CreateUserPayload): Promise<CreatedUser> {
    const response = await api.post<{ user: CreatedUser }>(
      API_ENDPOINTS.users.create,
      payload,
    );
    return response.data.user;
  }
}

export const userService = new UserService();
