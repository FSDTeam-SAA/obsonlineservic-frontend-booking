import { api } from "@/lib/api";
import { ResetPasswordRequest, ResetPasswordResponse } from "../types";

export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>("/auth/reset-password", data);
  return response.data;
}
