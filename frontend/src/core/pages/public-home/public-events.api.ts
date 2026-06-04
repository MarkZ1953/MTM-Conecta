import API_BASE_URL from "@/config/api.config";

export type PublicEventRecord = {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url?: string;
  image_public_id?: string;
  images?: Array<{
    id: number;
    image_url: string;
    image_public_id: string;
    order: number;
  }>;
};

export async function fetchPublicEvents(): Promise<PublicEventRecord[]> {
  const response = await fetch(`${API_BASE_URL}/public/events/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los eventos públicos.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.results ?? [];
}
