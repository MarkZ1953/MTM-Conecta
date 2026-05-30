export interface UserGroup {
  id: number;
  name: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  groups?: Array<string | UserGroup>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role_ids: number[];
}

export interface UserPasswordPayload {
  current_password: string | null;
  new_password: string;
  confirm_password: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
