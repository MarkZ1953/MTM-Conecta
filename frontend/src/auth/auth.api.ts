import API_BASE_URL from "@/config/api.config";
import { ResourceAPI } from "@/api";

class AuthAPI extends ResourceAPI {
  constructor() {
    super({ resource: "auth" });
  }

  async login({ username, password }: { username: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      return { status: response.status, data: await response.json() };
    } catch (error) {
      throw error;
    }
  }

  async register({
    data,
  }: {
    data: {
      first_name: string;
      last_name: string;
      username: string;
      password: string;
      confirm_password: string;
    };
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return { status: response.status, data: await response.json() };
    } catch (error) {
      throw error;
    }
  }

  async googleAuth({ credential }: { credential: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      return { status: response.status, data: await response.json() };
    } catch (error) {
      throw error;
    }
  }

  async refresh() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return { status: response.status, data: await response.json() };
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return { status: response.status, data: await response.json() };
    } catch (error) {
      throw error;
    }
  }
}

export const authAPI = new AuthAPI();
