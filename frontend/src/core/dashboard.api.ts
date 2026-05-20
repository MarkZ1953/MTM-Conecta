import API_BASE_URL from "@/config/api.config";

export interface DashboardMetrics {
  beneficiaries: number;
  donors: number;
  donations: {
    count: number;
    total_amount: number;
  };
  projects: {
    total: number;
    in_progress: number;
    finished: number;
  };
}

/**
 * Cliente del módulo de reportes. Consume los endpoints de agregación
 * expuestos por la app `reports` del backend (no son ViewSets, por eso
 * no extiende ResourceAPI).
 */
class DashboardAPI {
  private baseUrl = API_BASE_URL;

  async getMetrics(): Promise<{ status: number; data: DashboardMetrics }> {
    const response = await fetch(`${this.baseUrl}/reports/dashboard/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { status: response.status, data: await response.json() };
  }
}

export const dashboardAPI = new DashboardAPI();
