import API_BASE_URL from "@/config/api.config";
import { apiFetch } from "@/api";

export type PublicBlogPostRecord = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url?: string;
  image_alt?: string;
  published_at?: string | null;
};

type PublicBlogResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PublicBlogPostRecord[];
};

const BLOG_PUBLIC_ENDPOINT = `${API_BASE_URL}/public/blog/posts/`;
const NEWSLETTER_PUBLIC_ENDPOINT = `${API_BASE_URL}/public/newsletter/subscribe/`;

async function readJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(fallbackMessage);
  }

  return response.json() as Promise<T>;
}

export async function fetchPublicBlogPosts() {
  const response = await fetch(BLOG_PUBLIC_ENDPOINT, {
    method: "GET",
    credentials: "include",
  });

  const data = await readJsonResponse<PublicBlogResponse>(
    response,
    "No se pudieron cargar las publicaciones del blog.",
  );

  return data.results;
}

export async function fetchPublicBlogPost(slug: string) {
  const response = await fetch(`${BLOG_PUBLIC_ENDPOINT}${slug}/`, {
    method: "GET",
    credentials: "include",
  });

  return readJsonResponse<PublicBlogPostRecord>(
    response,
    "No se pudo cargar la publicación solicitada.",
  );
}

export async function subscribeToNewsletter(email: string) {
  const response = await apiFetch(NEWSLETTER_PUBLIC_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      origin: "BLOG",
      consent: true,
    }),
  });

  return readJsonResponse<{ message: string }>(
    response,
    "No pudimos registrar tu suscripción. Inténtalo nuevamente.",
  );
}
