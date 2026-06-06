import API_BASE_URL from "@/config/api.config";
import { apiFetch } from "@/api";
import type {
  CampaignTemplate,
  CampaignTemplatePayload,
  PaginatedResponse,
} from "./campaigns.types";

/**
 * Cliente de plantillas reutilizables de campaña.
 * CRUD JSON estándar (no maneja archivos).
 */
class CampaignTemplatesAPI {
  private baseUrl = API_BASE_URL;
  private resource = "campaign-templates";

  async getAll(): Promise<{ status: number; data: PaginatedResponse<CampaignTemplate> }> {
    const response = await apiFetch(`${this.baseUrl}/${this.resource}/?page_size=100`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return { status: response.status, data: await response.json() };
  }

  async create({
    data,
  }: {
    data: CampaignTemplatePayload;
  }): Promise<{ status: number; data: CampaignTemplate }> {
    const response = await apiFetch(`${this.baseUrl}/${this.resource}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { status: response.status, data: await response.json() };
  }

  async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
    const response = await apiFetch(`${this.baseUrl}/${this.resource}/${id}/soft-delete/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return { status: response.status, data: await response.json() };
  }
}

export const campaignTemplatesAPI = new CampaignTemplatesAPI();
