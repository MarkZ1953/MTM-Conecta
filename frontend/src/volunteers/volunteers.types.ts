export type VolunteerStatus = "PENDING" | "INTERVIEWED" | "APPROVED" | "REJECTED" | "INACTIVE";
export type SupportArea = "TECHNICAL" | "SOCIAL";

export const volunteerStatusLabels: Record<VolunteerStatus, string> = {
  PENDING: "Postulado",
  INTERVIEWED: "Entrevistado",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  INACTIVE: "Inactivo",
};

export const supportAreaLabels: Record<SupportArea, string> = {
  TECHNICAL: "Soporte Técnico",
  SOCIAL: "Gestión Social",
};

export interface VolunteerAvailability {
  id?: number;
  volunteer?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
}

export interface VolunteerTask {
  id?: number;
  volunteer?: number;
  title: string;
  description?: string;
  hours_spent: number | string;
  date: string;
  project?: number | null;
  project_name?: string;
  is_active?: boolean;
}

export interface Volunteer {
  id: number;
  first_name: string;
  last_name: string;
  identification_number: string;
  email: string;
  phone: string;
  profession: string;
  support_area: SupportArea;
  status: VolunteerStatus;
  notes?: string;
  availabilities: VolunteerAvailability[];
  total_hours_spent: number;
  is_active?: boolean;
}

export interface VolunteerPayload {
  first_name: string;
  last_name: string;
  identification_number: string;
  email: string;
  phone: string;
  profession: string;
  support_area: SupportArea;
  status: VolunteerStatus;
  notes?: string;
  availabilities: VolunteerAvailability[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
