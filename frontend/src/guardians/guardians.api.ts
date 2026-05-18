import { ResourceAPI } from "@/api";
import type { Guardian, GuardianPayload, PaginatedResponse } from "./guardians.types";

type GuardianQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  beneficiary?: number;
  [key: string]: string | number | boolean | null | undefined;
};

class GuardiansAPI extends ResourceAPI<Guardian> {
    constructor() {
        super({ resource: "guardians" });
    }

    async getAll({
      params,
    }: {
      params: GuardianQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<Guardian> }> {
      return super.getAll({ params }) as any;
    }
  
    async create({
      data,
    }: {
      data: GuardianPayload;
    }): Promise<{ status: number; data: Guardian }> {
      return super.create({ data }) as any;
    }
  
    async update({
      id,
      data,
    }: {
      id: number;
      data: Partial<GuardianPayload>;
    }): Promise<{ status: number; data: Guardian }> {
      return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.delete(id) as any;
    }
}

export const guardiansAPI = new GuardiansAPI();
