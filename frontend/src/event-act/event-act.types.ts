export interface EventAct {
    id: number;
    event: number;
    content: string;
    digital_signature_path: string | null;
}

export interface EventActPayload {
    event: number;
    content: string;
    // digital_signature_path es usualmente manejado como FormData, pero como string lo dejamos opcional
    digital_signature_path?: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
