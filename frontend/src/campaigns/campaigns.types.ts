export type CampaignContentType = "BUILDER" | "IMAGE" | "PDF";
export type CampaignRecipientGroup = "DONORS" | "GUARDIANS" | "USERS" | "NEWSLETTER" | "ALL";
export type CampaignStatus = "DRAFT" | "SENDING" | "SENT" | "FAILED";

export interface Campaign {
  id: number;
  subject: string;
  content_type: CampaignContentType;
  html_content: string;
  design_json: string;
  image: string | null;
  document: string | null;
  cta_text: string;
  cta_url: string;
  recipient_group: CampaignRecipientGroup;
  status: CampaignStatus;
  sent_at: string | null;
  sent_count: number;
  is_active: boolean;
}

export interface CampaignPayload {
  subject: string;
  content_type: CampaignContentType;
  recipient_group: CampaignRecipientGroup;
  html_content?: string;
  design_json?: string;
  cta_text?: string;
  cta_url?: string;
  // Archivos: solo presentes cuando el usuario sube uno nuevo
  image?: File | null;
  document?: File | null;
}

export interface CampaignTemplate {
  id: number;
  name: string;
  design_json: string;
  html_content: string;
  is_active: boolean;
}

export interface CampaignTemplatePayload {
  name: string;
  design_json: string;
  html_content: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
