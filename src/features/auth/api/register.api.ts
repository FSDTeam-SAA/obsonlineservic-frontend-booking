import { api } from "@/lib/api";
import { RegisterRequest, RegisterResponse } from "../types";

export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/auth/register", data);
  return response.data;
}
