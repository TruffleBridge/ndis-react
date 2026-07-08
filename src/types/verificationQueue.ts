export interface VerificationQueuePayload {
  offset: number;
  limit: number;
  search: string;
  type: "worker" | "client" | string;
}

export interface VerificationQueueItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  applicationDate: string;
  documentStatus: string;
  verificationType: string;
  status: string;
  avatar?: string;
}

export interface VerificationQueueResponse {
  data: VerificationQueueItem[];
  total: number;
}