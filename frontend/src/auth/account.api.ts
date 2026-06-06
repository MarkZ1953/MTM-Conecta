import API_BASE_URL from "@/config/api.config";
import { apiFetch } from "@/api";

const parseResponse = async (response: Response) => {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: "El servidor respondió con un formato inesperado. Revisa la terminal del backend.",
    };
  }
};

const request = async (path: string, options: RequestInit = {}) => {
  const response = await apiFetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  return { status: response.status, data: await parseResponse(response) };
};

const uploadRequest = async (path: string, formData: FormData) => {
  const response = await apiFetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    body: formData,
  });

  return { status: response.status, data: await parseResponse(response) };
};

export const accountAPI = {
  getAccount() {
    return request("/auth/me");
  },

  updateAccount(data: any) {
    return request("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  updateProfilePhoto(file: File) {
    const formData = new FormData();
    formData.append("photo", file);
    return uploadRequest("/auth/me", formData);
  },

  changePassword(data: {
    current_password?: string;
    new_password: string;
    confirm_password: string;
  }) {
    return request("/auth/me/password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  linkGoogle(credential: string) {
    return request("/auth/me/google/link", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });
  },

  unlinkGoogle() {
    return request("/auth/me/google/unlink", {
      method: "POST",
    });
  },
};
