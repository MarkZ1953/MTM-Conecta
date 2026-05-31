import { ResourceAPI } from "@/api";
import type {
    Company,
    CompanyPayload,
    CollectionPoint,
    CollectionPointPayload,
    CollectionRequest,
    CollectionRequestPayload,
    PaginatedResponse,
} from "./cap-collection.types";

type CompaniesQueryParams = {
    page?: number;
    page_size?: number;
    ordering?: string;
    search?: string;
    [key: string]: string | number | boolean | null | undefined;
};

type CollectionPointsQueryParams = {
    page?: number;
    page_size?: number;
    ordering?: string;
    company?: number;
    search?: string;
    [key: string]: string | number | boolean | null | undefined;
};

type CollectionRequestsQueryParams = {
    page?: number;
    page_size?: number;
    ordering?: string;
    status?: string;
    collection_point?: number;
    search?: string;
    [key: string]: string | number | boolean | null | undefined;
};

// ── Companies ──────────────────────────────────────────────

class CompaniesAPI extends ResourceAPI<Company> {
    constructor() {
        super({ resource: "companies" });
    }

    async getAll({
        params,
    }: {
        params: CompaniesQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<Company> }> {
        return super.getAll({ params }) as any;
    }

    async create({
        data,
    }: {
        data: CompanyPayload;
    }): Promise<{ status: number; data: Company }> {
        return super.create({ data }) as any;
    }

    async update({
        id,
        data,
    }: {
        id: number;
        data: Partial<CompanyPayload>;
    }): Promise<{ status: number; data: Company }> {
        return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.softDelete({ id }) as any;
    }
}

// ── Collection Points ──────────────────────────────────────

class CollectionPointsAPI extends ResourceAPI<CollectionPoint> {
    constructor() {
        super({ resource: "collection-points" });
    }

    async getAll({
        params,
    }: {
        params: CollectionPointsQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<CollectionPoint> }> {
        return super.getAll({ params }) as any;
    }

    async create({
        data,
    }: {
        data: CollectionPointPayload;
    }): Promise<{ status: number; data: CollectionPoint }> {
        return super.create({ data }) as any;
    }

    async update({
        id,
        data,
    }: {
        id: number;
        data: Partial<CollectionPointPayload>;
    }): Promise<{ status: number; data: CollectionPoint }> {
        return super.update({ id, data }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.softDelete({ id }) as any;
    }
}

// ── Collection Requests ────────────────────────────────────

class CollectionRequestsAPI extends ResourceAPI<CollectionRequest> {
    constructor() {
        super({ resource: "collection-requests" });
    }

    async getAll({
        params,
    }: {
        params: CollectionRequestsQueryParams;
    }): Promise<{ status: number; data: PaginatedResponse<CollectionRequest> }> {
        return super.getAll({ params }) as any;
    }

    async create({
        data,
    }: {
        data: Partial<CollectionRequest> | CollectionRequestPayload;
    }): Promise<{ status: number; data: CollectionRequest }> {
        return super.create({ data: data as Partial<CollectionRequest> }) as any;
    }

    async update({
        id,
        data,
    }: {
        id: number;
        data: Partial<CollectionRequest> | Partial<CollectionRequestPayload>;
    }): Promise<{ status: number; data: CollectionRequest }> {
        return super.update({ id, data: data as Partial<CollectionRequest> }) as any;
    }

    async softDelete({ id }: { id: number }): Promise<{ status: number; data: any }> {
        return super.softDelete({ id }) as any;
    }
}

export const companiesAPI = new CompaniesAPI();
export const collectionPointsAPI = new CollectionPointsAPI();
export const collectionRequestsAPI = new CollectionRequestsAPI();
