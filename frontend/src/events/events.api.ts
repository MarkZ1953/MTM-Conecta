import { ResourceAPI } from "@/api";
import type { Event, EventPayload, PaginatedResponse } from "./events.types";

type EventsQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  title?: string;
  location?: string;
  [key: string]: string | number | boolean | null | undefined;
};

class EventsAPI extends ResourceAPI<Event> {
    constructor() {
        super({ resource: "events" });
    }

    async getAll({
      params,
    }: {
      params: EventsQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<Event> }> {
      return super.getAll({ params }) as any;
    }
  
    async create({
      data,
    }: {
      data: EventPayload;
    }): Promise<{ status: number; data: Event }> {
      return super.create({ data }) as any;
    }
  
    async update({
      id,
      data,
    }: {
      id: number;
      data: Partial<EventPayload>;
    }): Promise<{ status: number; data: Event }> {
      return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.softDelete({ id }) as any;
    }
}

export const eventsAPI = new EventsAPI();
