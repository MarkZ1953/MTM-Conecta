import { createContext } from "react";

export interface AuthContextType {
  logged: boolean;
  user: any | null;
  logout: () => Promise<void>;
  refresh: () => Promise<any | null>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
