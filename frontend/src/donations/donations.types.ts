export type DonationType = "ECOAPORTE" | "PERMANENT_SPONSOR";
export type DonationStatus = "PENDING" | "COMPLETED" | "FAILED";

export const donationTypeLabels: Record<DonationType, string> = {
    ECOAPORTE: "Bono Donación / Ecoaporte",
    PERMANENT_SPONSOR: "Padrino Permanente",
};

export const donationStatusLabels: Record<DonationStatus, string> = {
    PENDING: "Pendiente",
    COMPLETED: "Completada",
    FAILED: "Fallida",
};

export interface Donation {
    id: number;
    donor: number; // ID del Donor
    amount: string;
    donation_type: DonationType;
    date: string;
    status: DonationStatus;
    is_active: boolean;
}

export interface DonationPayload {
    donor: number;
    amount: number | string;
    donation_type: DonationType;
    status: DonationStatus;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
