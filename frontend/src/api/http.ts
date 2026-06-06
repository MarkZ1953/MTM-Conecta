const CSRF_SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function getCookie(name: string) {
  if (typeof document === "undefined") return "";

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=") ?? "";
}

export function getCsrfToken() {
  const token = getCookie("csrftoken");
  return token ? decodeURIComponent(token) : "";
}

export function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  const csrfToken = getCsrfToken();

  if (!CSRF_SAFE_METHODS.has(method) && csrfToken && !headers.has("X-CSRFToken")) {
    headers.set("X-CSRFToken", csrfToken);
  }

  return fetch(input, {
    credentials: "include",
    ...init,
    headers,
  });
}
