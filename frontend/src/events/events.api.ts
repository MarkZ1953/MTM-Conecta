import { ResourceAPI } from "@/api";
import { apiFetch } from "@/api";
import API_BASE_URL from "@/config/api.config";
import type { Event, EventPayload, PaginatedResponse } from "./events.types";

type EventsQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  title?: string;
  location?: string;
  [key: string]: string | number | boolean | null | undefined;
};

const toFormData = (data: Partial<EventPayload>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item);
        }
      });
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

class EventsAPI extends ResourceAPI<Event> {
    private eventsBaseUrl = API_BASE_URL;
    private eventsResource = "events";

    constructor() {
        super({ resource: "events" });
    }

    async getAll({
      params,
    }: {
      params: EventsQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<Event> }> {
      return super.getAll({ params }) as Promise<{ status: number; data: PaginatedResponse<Event> }>;
    }
  
    async create({
      data,
    }: {
      data: EventPayload;
    }): Promise<{ status: number; data: Event }> {
      const response = await apiFetch(`${this.eventsBaseUrl}/${this.eventsResource}/`, {
        method: "POST",
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
      data: Partial<EventPayload>;
    }): Promise<{ status: number; data: Event }> {
      const response = await apiFetch(`${this.eventsBaseUrl}/${this.eventsResource}/${id}/`, {
        method: "PATCH",
        body: toFormData(data),
      });
      const result = { status: response.status, data: await response.json() };
      this.hooks.afterUpdate?.(result);
      this.hooks.onSuccess?.("update", result);
      return result;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: Event }> {
        return super.softDelete({ id }) as Promise<{ status: number; data: Event }>;
    }
}

export const eventsAPI = new EventsAPI();
