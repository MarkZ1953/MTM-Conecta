import API_BASE_URL from "@/config/api.config";

export type PublicInstagramPostRecord = {
  id: number;
  instagram_id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: Array<{
    id?: string;
    media_type?: string;
    media_url?: string;
    thumbnail_url?: string;
    permalink?: string;
    timestamp?: string;
  }>;
  is_featured?: boolean;
};

type PublicInstagramResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PublicInstagramPostRecord[];
};

const INSTAGRAM_PUBLIC_ENDPOINT = `${API_BASE_URL}/public/instagram-posts/`;

async function readJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(fallbackMessage);
  }

  return response.json() as Promise<T>;
}

export async function fetchPublicInstagramPosts() {
  const response = await fetch(INSTAGRAM_PUBLIC_ENDPOINT, {
    method: "GET",
    credentials: "include",
  });

  const data = await readJsonResponse<PublicInstagramResponse>(
    response,
    "No se pudieron cargar las publicaciones de Instagram.",
  );

  return data.results;
}

export async function fetchPublicInstagramPost(instagramId: string) {
  const response = await fetch(`${INSTAGRAM_PUBLIC_ENDPOINT}${instagramId}/`, {
    method: "GET",
    credentials: "include",
  });

  return readJsonResponse<PublicInstagramPostRecord>(
    response,
    "No se pudo cargar la publicación solicitada.",
  );
}
