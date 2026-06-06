import type { InferType } from "yup";
import type { subscriberBaseSchema } from "./subscribers.schemas";

export type SubscriberStatus = "ACTIVE" | "UNSUBSCRIBED";
export type SubscriberOrigin = "BLOG" | "HOME" | "CAMPAIGN" | "ADMIN" | "OTHER";

export interface NewsletterSubscriber {
  id: number;
  email: string;
  name: string;
  status: SubscriberStatus;
  origin: SubscriberOrigin;
  consent: boolean;
  subscribed_at: string;
  unsubscribed_at?: string | null;
  notes: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

export type NewsletterSubscriberPayload = InferType<typeof subscriberBaseSchema>;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
