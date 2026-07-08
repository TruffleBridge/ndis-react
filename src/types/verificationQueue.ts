export interface VerificationQueuePayload {
  offset: number;
  limit: number;
  search: string;
  type: "worker" | "client" | string;
}

export interface VerificationQueueItem {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  profilePicture:string;
  createdAt: string;
  uploadedDocumentCount: string;
  verificationType: string;
  status: string;
}

export interface VerificationQueueResponse {
  data: VerificationQueueItem[];
  total: number;
}