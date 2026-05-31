export type DonorType = "PERSON" | "FAMILY" | "COMPANY";
export type SponsorCategory = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export const donorTypeLabels: Record<DonorType, string> = {
    PERSON: "Persona natural",
    FAMILY: "Familia",
    COMPANY: "Empresa",
};

export const sponsorCategoryLabels: Record<SponsorCategory, string> = {
    BRONZE: "Bronce (Nivel 1)",
    SILVER: "Plata (Nivel 2)",
    GOLD: "Oro (Nivel 3)",
    PLATINUM: "Platino (Nivel 4)",
};

export interface Donor {
    id: number;
    user: number;
    donor_type: DonorType;
    organization_name: string;
    first_name: string;
    last_name: string;
    email: string;
    subscription_amount: string | number;
    payment_day: number;
    category: SponsorCategory;
    marketing_opt_in: boolean;
}

export interface DonorPayload {
    user: number;
    donor_type: DonorType;
    organization_name: string;
    first_name: string;
    last_name: string;
    email: string;
    subscription_amount: string | number;
    payment_day: number;
    marketing_opt_in: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
