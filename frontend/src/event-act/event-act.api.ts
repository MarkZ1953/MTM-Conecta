import { ResourceAPI } from "@/api";
import type { EventAct, EventActPayload, PaginatedResponse } from "./event-act.types";

type EventActQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  event?: number;
  [key: string]: string | number | boolean | null | undefined;
};

class EventActAPI extends ResourceAPI<EventAct> {
    constructor() {
        super({ resource: "event-acts" });
    }

    async getAll({
      params,
    }: {
      params: EventActQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<EventAct> }> {
      return super.getAll({ params }) as any;
    }
  
    async create({
      data,
    }: {
      data: EventActPayload;
    }): Promise<{ status: number; data: EventAct }> {
      return super.create({ data }) as any;
    }
  
    async update({
      id,
      data,
    }: {
      id: number;
      data: Partial<EventActPayload>;
    }): Promise<{ status: number; data: EventAct }> {
      return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.softDelete({ id }) as any;
    }
}

export const eventActAPI = new EventActAPI();
