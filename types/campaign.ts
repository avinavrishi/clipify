export type CampaignStatus = "ACTIVE" | "PAUSED" | "COMPLETED";

export type CampaignContentType = "VIDEO" | "IMAGE";

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  category?: string;
  content_type: CampaignContentType;
  description?: string;
  total_budget: number;
  used_budget: number;
  rate_per_million_views: number;
  max_submissions_per_account?: number;
  max_earnings_per_creator?: number;
  max_earnings_per_post?: number;
  start_date: string;
  end_date: string;
  status: CampaignStatus;
  logo_drive_link?: string;
  guidelines_link?: string;
  discord_link?: string;
  created_at: string;
}

export type CampaignCreateRequest = Omit<
  Campaign,
  "id" | "brand_id" | "used_budget" | "status" | "created_at"
>;

