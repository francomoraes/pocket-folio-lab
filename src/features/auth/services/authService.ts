import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { AuthResponse, LoginRequest } from "@/features/auth/types/auth";

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      data,
    );
    return response.data;
  }

  async register(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      data,
    );
    return response.data;
  }

  async updateUser(data: Partial<AuthResponse> & { id: number }) {
    const response = await api.put<AuthResponse>(
      API_ENDPOINTS.auth.updateUser.replace(":id", data.id.toString()),
      data,
    );
    return response.data;
  }
}

export const authService = new AuthService();
