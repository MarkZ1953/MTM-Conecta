import API_BASE_URL from "@/config/api.config";
import type { Campaign, CampaignPayload, PaginatedResponse } from "./campaigns.types";

type CampaignsQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  [key: string]: string | number | boolean | null | undefined;
};

/**
 * Convierte el payload de campaña en FormData.
 * Necesario porque la campaña puede incluir archivos (image/document),
 * y los archivos no viajan en JSON: requieren multipart/form-data.
 * Solo agrega los campos definidos (omite undefined/null).
 */
const toFormData = (data: Partial<CampaignPayload>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

/**
 * Cliente del módulo de campañas.
 * No extiende ResourceAPI porque maneja subida de archivos (multipart/form-data)
 * y un endpoint de envío propio, que difieren del CRUD JSON estándar.
 */
class CampaignsAPI {
  private baseUrl = API_BASE_URL;
  private resource = "campaigns";

  async getAll({
    params,
  }: {
    params: CampaignsQueryParams;
  }): Promise<{ status: number; data: PaginatedResponse<Campaign> }> {
    const searchParams = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(
      `${this.baseUrl}/${this.resource}/?${searchParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );

    return { status: response.status, data: await response.json() };
  }

  /**
   * Crea una campaña enviando multipart/form-data.
   * NO se setea Content-Type: el navegador lo pone con el boundary correcto.
   */
  async create({
    data,
  }: {
    data: CampaignPayload;
  }): Promise<{ status: number; data: Campaign }> {
    const response = await fetch(`${this.baseUrl}/${this.resource}/`, {
      method: "POST",
      credentials: "include",
      body: toFormData(data),
    });
    return { status: response.status, data: await response.json() };
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<CampaignPayload>;
  }): Promise<{ status: number; data: Campaign }> {
    const response = await fetch(`${this.baseUrl}/${this.resource}/${id}/`, {
      method: "PATCH",
      credentials: "include",
      body: toFormData(data),
    });
    return { status: response.status, data: await response.json() };
  }

  async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
    const response = await fetch(
      `${this.baseUrl}/${this.resource}/${id}/soft-delete/`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );
    return { status: response.status, data: await response.json() };
  }

  async bulkSoftDelete({ ids }: { ids: number[] }): Promise<{ status: number; data: any }> {
    const response = await fetch(
      `${this.baseUrl}/${this.resource}/bulk-soft-delete/`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      },
    );
    return { status: response.status, data: await response.json() };
  }

  /**
   * Dispara el envío de la campaña al grupo de destinatarios.
   * POST /campaigns/<id>/send/
   */
  async send({ id }: { id: number }): Promise<{ status: number; data: any }> {
    const response = await fetch(`${this.baseUrl}/${this.resource}/${id}/send/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return { status: response.status, data: await response.json() };
  }
}

export const campaignsAPI = new CampaignsAPI();
