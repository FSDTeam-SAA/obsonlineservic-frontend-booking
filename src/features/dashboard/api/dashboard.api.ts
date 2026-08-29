import { api } from "@/lib/api";
import { DashboardOverviewData } from "../types/dashboard.types";

/**
 * Fetch Public Aggregated Platform Overview Stats
 */
export async function fetchPublicDashboardOverview(): Promise<DashboardOverviewData> {
  const response = await api.get("/dashboard/overview");
  return response.data?.data || response.data;
}
