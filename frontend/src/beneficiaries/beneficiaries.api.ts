import { ResourceAPI } from "@/api";
import type { Beneficiary, BeneficiaryPayload, PaginatedResponse } from "./beneficiaries.types";

type BeneficiariesQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  first_name?: string;
  last_name?: string;
  identification_number?: string;
  [key: string]: string | number | boolean | null | undefined;
};

class BeneficiariesAPI extends ResourceAPI<Beneficiary> {
    constructor() {
        super({ resource: "beneficiaries" });
    }

    async getAll({
      params,
    }: {
      params: BeneficiariesQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<Beneficiary> }> {
      return super.getAll({ params }) as any;
    }
  
    async create({
      data,
    }: {
      data: BeneficiaryPayload;
    }): Promise<{ status: number; data: Beneficiary }> {
      return super.create({ data }) as any;
    }
  
    async update({
      id,
      data,
    }: {
      id: number;
      data: Partial<BeneficiaryPayload>;
    }): Promise<{ status: number; data: Beneficiary }> {
      return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
    return super.softDelete({ id }) as any;
}
}

export const beneficiariesAPI = new BeneficiariesAPI();