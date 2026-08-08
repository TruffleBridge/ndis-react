export interface NotificationData {
  id: string | number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  icon?: string;
}

export interface NotificationListPayload {
  offset: number;
  limit: number;
  search: string;
}

export interface NotificationListApiResponse {
  status: boolean;
  message: string;
  data: {
    count: number;
    totalCount: number;
    result: NotificationData[];
  };
}

export interface UpdateReadStatusApiResponse {
  status: boolean;
  message: string;
}