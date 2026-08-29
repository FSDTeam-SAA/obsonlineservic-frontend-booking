import { api } from "@/lib/api";
import { SubscribeNewsletterDto, SubscribeResponse } from "../types";

export async function subscribeToNewsletter(dto: SubscribeNewsletterDto): Promise<SubscribeResponse> {
  const response = await api.post<SubscribeResponse>("/newsletter/subscribe", dto);
  return response.data;
}
