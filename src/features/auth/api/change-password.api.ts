import { api } from "@/lib/api";
import { ChangePasswordRequest, ChangePasswordResponse } from "../types";

export async function changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  const response = await api.post<ChangePasswordResponse>("/auth/change-password", data);
  return response.data;
}
