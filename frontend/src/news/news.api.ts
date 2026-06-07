import { ResourceAPI, apiFetch } from "@/api";
import API_BASE_URL from "@/config/api.config";
import type { InstagramPost, PaginatedResponse } from "./news.types";

type InstagramQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  [key: string]: string | number | boolean | null | undefined;
};

class NewsAPI extends ResourceAPI<InstagramPost> {
  private newsBaseUrl = API_BASE_URL;
  private newsResource = "instagram-posts";

  constructor() {
    super({ resource: "instagram-posts" });
  }

  async getAll({
    params,
  }: {
    params: InstagramQueryParams;
  }): Promise<{ status: number; data: PaginatedResponse<InstagramPost> }> {
    return super.getAll({ params }) as Promise<{ status: number; data: PaginatedResponse<InstagramPost> }>;
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<InstagramPost>;
  }): Promise<{ status: number; data: InstagramPost }> {
    return super.update({ id, data }) as Promise<{ status: number; data: InstagramPost }>;
  }

  async sync(): Promise<{ message: string; created: number; updated: number; total: number }> {
    const response = await apiFetch(`${this.newsBaseUrl}/${this.newsResource}/sync/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "No se pudo sincronizar Instagram.");
    }

    return data;
  }
}

export const newsAPI = new NewsAPI();

