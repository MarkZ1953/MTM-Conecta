import { apiFetch, ResourceAPI } from "@/api";
import type { Volunteer, VolunteerPayload, VolunteerTask, PaginatedResponse } from "./volunteers.types";

type VolunteerQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  status?: string;
  support_area?: string;
  [key: string]: string | number | boolean | null | undefined;
};

class VolunteersAPI extends ResourceAPI<Volunteer> {
  constructor() {
    super({ resource: "volunteers" });
  }

  async getAll({
    params,
  }: {
    params: VolunteerQueryParams;
  }): Promise<{ status: number; data: PaginatedResponse<Volunteer> }> {
    return super.getAll({ params }) as any;
  }

  async create({
    data,
  }: {
    data: VolunteerPayload;
  }): Promise<{ status: number; data: Volunteer }> {
    return super.create({ data }) as any;
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<VolunteerPayload>;
  }): Promise<{ status: number; data: Volunteer }> {
    return super.update({ id, data }) as any;
  }

  async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
    return super.softDelete({ id }) as any;
  }

  async publicRegister(data: any): Promise<{ status: number; data: Volunteer }> {
    // We construct the URL relative to the existing base class or config
    // Let's import the base API URL to make it completely robust
    const apiConfig = await import("@/config/api.config");
    const baseUrl = apiConfig.default;
    const response = await apiFetch(`${baseUrl}/volunteers/public-register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return { status: response.status, data: await response.json() };
  }
}

class VolunteerTasksAPI extends ResourceAPI<VolunteerTask> {
  constructor() {
    super({ resource: "volunteer-tasks" });
  }

  async getAll({
    params,
  }: {
    params: {
      page?: number;
      page_size?: number;
      ordering?: string;
      volunteer?: number;
      [key: string]: any;
    };
  }): Promise<{ status: number; data: PaginatedResponse<VolunteerTask> }> {
    return super.getAll({ params }) as any;
  }

  async create({
    data,
  }: {
    data: Partial<VolunteerTask>;
  }): Promise<{ status: number; data: VolunteerTask }> {
    return super.create({ data }) as any;
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<VolunteerTask>;
  }): Promise<{ status: number; data: VolunteerTask }> {
    return super.update({ id, data }) as any;
  }

  async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
    return super.softDelete({ id }) as any;
  }
}

export const volunteersAPI = new VolunteersAPI();
export const volunteerTasksAPI = new VolunteerTasksAPI();
