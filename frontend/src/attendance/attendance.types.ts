export interface Attendance {
    id: number;
    beneficiary: number;
    event: number;
    attended: boolean;
    notes: string;
}

export interface AttendancePayload {
    beneficiary: number;
    event: number;
    attended: boolean;
    notes?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
