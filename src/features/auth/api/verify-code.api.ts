import { api } from "@/lib/api";
import { VerifyOtpRequest, VerifyOtpResponse } from "../types";

export async function verifyCode(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  const response = await api.post<VerifyOtpResponse>("/auth/verify-code", data);
  return response.data;
}
