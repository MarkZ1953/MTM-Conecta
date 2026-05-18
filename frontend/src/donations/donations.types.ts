export interface Donation {
    id: number;
    donor: number; // ID del Donor
    amount: string;
    date: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    is_active: boolean;
}

export interface DonationPayload {
    donor: number;
    amount: number | string;
    status: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
