import { ResourceAPI } from "@/api";
import type { NewsletterSubscriber, NewsletterSubscriberPayload, PaginatedResponse } from "./subscribers.types";

type SubscribersQueryParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
  email?: string;
  name?: string;
  status?: string;
  origin?: string;
  [key: string]: string | number | boolean | null | undefined;
};

class SubscribersAPI extends ResourceAPI<NewsletterSubscriber> {
  constructor() {
    super({ resource: "subscribers" });
  }

  async getAll({
    params,
  }: {
    params: SubscribersQueryParams;
  }): Promise<{ status: number; data: PaginatedResponse<NewsletterSubscriber> }> {
    return super.getAll({ params }) as Promise<{ status: number; data: PaginatedResponse<NewsletterSubscriber> }>;
  }

  async create({
    data,
  }: {
    data: NewsletterSubscriberPayload;
  }): Promise<{ status: number; data: NewsletterSubscriber }> {
    return super.create({ data }) as Promise<{ status: number; data: NewsletterSubscriber }>;
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<NewsletterSubscriberPayload>;
  }): Promise<{ status: number; data: NewsletterSubscriber }> {
    return super.update({ id, data }) as Promise<{ status: number; data: NewsletterSubscriber }>;
  }

  async softDelete({ id }: { id: number }): Promise<{ status: number; data: NewsletterSubscriber }> {
    return super.softDelete({ id }) as Promise<{ status: number; data: NewsletterSubscriber }>;
  }
}

export const subscribersAPI = new SubscribersAPI();
