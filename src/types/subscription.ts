export type SubscriptionType =
  | "Basic"
  | "Professional"
  | "Premium";

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
}

export interface SubscriptionForm {
  subscriptionId?: number;

  name: string;
  type: SubscriptionType;
  description: string;

  monthlyPrice: number;
  annualPrice: number;

  maxWorkers: number;

  isAiEnabled: boolean;
  isPopular: boolean;
  isUrgentShift: boolean;
  isActive: boolean;

  featureFlags: FeatureFlag[];
}

export interface SubscriptionFilters {
  search?: string;

  filters?: {
    status?: boolean;
    type?: string;
    isPopular?: boolean;
    isAiEnabled?: boolean;
  };

  offset?: number;
  limit?: number;
}

export interface SubscriptionItem {
  subscriptionId: number;

  name: string;
  type: string;
  description: string;

  monthlyPrice: number;
  annualPrice: number;

  maxWorkers: number;

  isAiEnabled: boolean;
  isPopular: boolean;
  isUrgentShift: boolean;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;

  featureFlags?: FeatureFlag[];
}

export interface SubscriptionListResponse {
  data: SubscriptionItem[];
  total: number;
  offset: number;
  limit: number;
}