export interface Evidence {
    id: number;
    event: number;
    file: string | null;
    description: string;
}

export interface EvidencePayload {
    event: number;
    file?: string | null;
    description: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
