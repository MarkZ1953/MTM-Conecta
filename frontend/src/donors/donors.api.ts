import { ResourceAPI } from "@/api";
import type { Donor, DonorPayload, PaginatedResponse } from "./donors.types";

type DonorQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  donor_type?: string;
  [key: string]: string | number | boolean | null | undefined;
};

class DonorsAPI extends ResourceAPI<Donor> {
    constructor() {
        super({ resource: "donors" });
    }

    async getAll({
      params,
    }: {
      params: DonorQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<Donor> }> {
      return super.getAll({ params }) as any;
    }
  
    async create({
      data,
    }: {
      data: DonorPayload;
    }): Promise<{ status: number; data: Donor }> {
      return super.create({ data }) as any;
    }
  
    async update({
      id,
      data,
    }: {
      id: number;
      data: Partial<DonorPayload>;
    }): Promise<{ status: number; data: Donor }> {
      return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.softDelete({ id }) as any;
    }
}

export const donorsAPI = new DonorsAPI();
