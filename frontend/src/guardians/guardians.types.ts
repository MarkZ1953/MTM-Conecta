export interface Guardian {
    id: number;
    beneficiary: number;
    first_name: string;
    last_name: string;
    identification_number: string;
    phone_number: string;
    email: string;
}

export interface GuardianPayload {
    beneficiary: number;
    first_name: string;
    last_name: string;
    identification_number: string;
    phone_number: string;
    email: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
