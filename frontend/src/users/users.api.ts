import API_BASE_URL from "@/config/api.config";
import { ResourceAPI } from "@/api";
import type { PaginatedResponse, User, UserPasswordPayload, UserPayload } from "./users.types";

type UsersQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  [key: string]: string | number | boolean | null | undefined;
};

class UsersAPI extends ResourceAPI<User> {
  constructor() {
    super({ resource: "users" });
  }

  async getAll({
    params,
  }: {
    params: UsersQueryParams;
  }): Promise<{ status: number; data: PaginatedResponse<User> }> {
    return super.getAll({ params });
  }

  async create({
    data,
  }: {
    data: UserPayload;
  }): Promise<{ status: number; data: User }> {
    return super.create({ data });
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<UserPayload>;
  }): Promise<{ status: number; data: User }> {
    return super.update({ id, data });
  }

  async getById(id: number): Promise<{ status: number; data: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    return { status: response.status, data: await response.json() };
  }

  async changePassword(
    id: number,
    data: UserPasswordPayload,
  ): Promise<{ status: number; data: unknown }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/change-password/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return { status: response.status, data: await response.json() };
  }
}

export const usersAPI = new UsersAPI();
