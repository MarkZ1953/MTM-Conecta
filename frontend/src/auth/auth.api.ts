import API_BASE_URL from "@/config/api.config";
import { apiFetch, ResourceAPI } from "@/api";

class AuthAPI extends ResourceAPI {
  constructor() {
    super({ resource: "auth" });
  }

  async csrf() {
    const response = await apiFetch(`${API_BASE_URL}/auth/csrf`, {
      method: "GET",
    });
    return { status: response.status, data: await response.json() };
  }

  async login({ username, password }: { username: string; password: string }) {
    try {
      await this.csrf();
      const response = await apiFetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
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
      await this.csrf();
      const response = await apiFetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
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
      await this.csrf();
      const response = await apiFetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
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
      await this.csrf();
      const response = await apiFetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
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
      const response = await apiFetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
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
