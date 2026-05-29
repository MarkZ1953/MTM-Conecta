export type CollectionRequestStatus =
    | "PENDING"
    | "ASSIGNED"
    | "IN_ROUTE"
    | "COLLECTED"
    | "CANCELLED";

export interface Company {
    id: number;
    nit: string;
    business_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    is_active: boolean;
}

export interface CompanyPayload {
    nit: string;
    business_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
}

export interface CollectionPoint {
    id: number;
    company: number;
    company_name: string;
    name: string;
    address: string;
    municipality: string;
    department: string;
    contact_name: string | null;
    contact_phone: string | null;
    is_active: boolean;
}

export interface CollectionPointPayload {
    company: number;
    name: string;
    address: string;
    municipality: string;
    department: string;
    contact_name?: string;
    contact_phone?: string;
}

export interface CollectionRequest {
    id: number;
    collection_point: number;
    collection_point_name: string;
    company_name: string;
    status: CollectionRequestStatus;
    estimated_weight_kg: string;
    scheduled_date: string;
    driver_name: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
}

export interface CollectionRequestPayload {
    collection_point: number;
    status: string;
    estimated_weight_kg: number | string;
    scheduled_date: string;
    driver_name?: string;
    notes?: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
