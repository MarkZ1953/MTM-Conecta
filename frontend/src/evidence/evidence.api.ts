import { ResourceAPI } from "@/api";
import type { Evidence, EvidencePayload, PaginatedResponse } from "./evidence.types";

type EvidenceQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  event?: number;
  [key: string]: string | number | boolean | null | undefined;
};

class EvidenceAPI extends ResourceAPI<Evidence> {
    constructor() {
        super({ resource: "evidences" });
    }

    async getAll({
      params,
    }: {
      params: EvidenceQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<Evidence> }> {
      return super.getAll({ params }) as any;
    }
  
    async create({
      data,
    }: {
      data: EvidencePayload;
    }): Promise<{ status: number; data: Evidence }> {
      return super.create({ data }) as any;
    }
  
    async update({
      id,
      data,
    }: {
      id: number;
      data: Partial<EvidencePayload>;
    }): Promise<{ status: number; data: Evidence }> {
      return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.delete(id) as any;
    }
}

export const evidenceAPI = new EvidenceAPI();
