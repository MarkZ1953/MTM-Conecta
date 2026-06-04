export interface EventImage {
    id: number;
    image_url: string;
    image_public_id: string;
    order: number;
    created_at?: string;
    updated_at?: string;
    is_active: boolean;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    image_url?: string;
    image_public_id?: string;
    images?: EventImage[];
    attendees_count?: number;
    evidences_count?: number;
    created_at?: string;
    updated_at?: string;
    is_active: boolean;
}

export interface EventPayload {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    image_uploads: File[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
