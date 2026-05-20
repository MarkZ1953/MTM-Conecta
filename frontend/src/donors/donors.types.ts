export interface Donor {
    id: number;
    user: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface DonorPayload {
    user: number;
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
