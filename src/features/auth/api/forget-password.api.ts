import { api } from "@/lib/api";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "../types";

export async function forgetPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  const response = await api.post<ForgotPasswordResponse>("/auth/forget-password", data);
  return response.data;
}
