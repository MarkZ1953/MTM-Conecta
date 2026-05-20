export interface Beneficiary {
    id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    identification_number: string;
    photo: string | null;
    authorization_doc: string | null;
    registration_date: string;
    notes: string | null;
    is_active: boolean;
}

export interface BeneficiaryPayload {
    first_name: string;
    last_name: string;
    birth_date: string;
    identification_number: string;
    notes?: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}