import type { Pagination } from "./api";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "order_update" | "review_update" | "operational_alert" | "system";
  isRead: boolean;
  readAt?: string | null;
  link?: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: Pagination;
}
