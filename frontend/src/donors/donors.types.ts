export type DonorType = "PERSON" | "FAMILY" | "COMPANY";

export const donorTypeLabels: Record<DonorType, string> = {
    PERSON: "Persona natural",
    FAMILY: "Familia",
    COMPANY: "Empresa",
};

export interface Donor {
    id: number;
    user: number;
    donor_type: DonorType;
    organization_name: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface DonorPayload {
    user: number;
    donor_type: DonorType;
    organization_name: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
