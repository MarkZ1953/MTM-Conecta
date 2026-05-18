import { ResourceAPI } from "@/api";
import type { Donation, DonationPayload, PaginatedResponse } from "./donations.types";

type DonationsQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  status?: string;
  [key: string]: string | number | boolean | null | undefined;
};

class DonationsAPI extends ResourceAPI<Donation> {
    constructor() {
        super({ resource: "donations" });
    }

    async getAll({
      params,
    }: {
      params: DonationsQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<Donation> }> {
      return super.getAll({ params }) as any;
    }
  
    async create({
      data,
    }: {
      data: DonationPayload;
    }): Promise<{ status: number; data: Donation }> {
      return super.create({ data }) as any;
    }
  
    async update({
      id,
      data,
    }: {
      id: number;
      data: Partial<DonationPayload>;
    }): Promise<{ status: number; data: Donation }> {
      return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.delete(id) as any;
    }
}

export const donationsAPI = new DonationsAPI();
