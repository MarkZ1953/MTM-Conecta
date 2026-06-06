import { ResourceAPI } from "@/api";
import API_BASE_URL from "@/config/api.config";
import type { BlogPost, BlogPostPayload, PaginatedResponse } from "./blog.types";

type BlogQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  title?: string;
  slug?: string;
  status?: string;
  [key: string]: string | number | boolean | null | undefined;
};

const toFormData = (data: Partial<BlogPostPayload>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }
    if (key === "published_at" && typeof value === "string") {
      formData.append(key, new Date(value).toISOString());
      return;
    }
    formData.append(key, String(value));
  });

  return formData;
};

class BlogAPI extends ResourceAPI<BlogPost> {
  private blogBaseUrl = API_BASE_URL;
  private blogResource = "blog-posts";

  constructor() {
    super({ resource: "blog-posts" });
  }

  async getAll({
    params,
  }: {
    params: BlogQueryParams;
  }): Promise<{ status: number; data: PaginatedResponse<BlogPost> }> {
    return super.getAll({ params }) as Promise<{ status: number; data: PaginatedResponse<BlogPost> }>;
  }

  async create({
    data,
  }: {
    data: BlogPostPayload;
  }): Promise<{ status: number; data: BlogPost }> {
    const response = await fetch(`${this.blogBaseUrl}/${this.blogResource}/`, {
      method: "POST",
      credentials: "include",
      body: toFormData(data),
    });
    const result = { status: response.status, data: await response.json() };
    this.hooks.afterCreate?.(result);
    this.hooks.onSuccess?.("create", result);
    return result;
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<BlogPostPayload>;
  }): Promise<{ status: number; data: BlogPost }> {
    const response = await fetch(`${this.blogBaseUrl}/${this.blogResource}/${id}/`, {
      method: "PATCH",
      credentials: "include",
      body: toFormData(data),
    });
    const result = { status: response.status, data: await response.json() };
    this.hooks.afterUpdate?.(result);
    this.hooks.onSuccess?.("update", result);
    return result;
  }

  async softDelete({ id }: { id: number }): Promise<{ status: number; data: BlogPost }> {
    return super.softDelete({ id }) as Promise<{ status: number; data: BlogPost }>;
  }
}

export const blogAPI = new BlogAPI();
