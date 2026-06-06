import type { InferType } from "yup";
import type { blogPostBaseSchema } from "./blog.schemas";

export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url?: string;
  image_public_id?: string;
  image_alt?: string;
  published_at?: string | null;
  status: BlogPostStatus;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

export type BlogPostPayload = InferType<typeof blogPostBaseSchema>;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
