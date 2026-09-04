import { api, buildQuery } from "./client";
import { getToken } from "../auth/token";
import type { NotificationListResponse, Notification } from "../types/notification";

export const notificationApi = {
  list: (query: { page?: number; limit?: number; unreadOnly?: boolean } = {}) =>
    api<NotificationListResponse>(`/notifications${buildQuery(query as Record<string, string | number | boolean | undefined>)}`, {}, getToken()),

  markAsRead: (id: string) =>
    api<{ notification: Notification }>(`/notifications/${id}/read`, { method: "PATCH" }, getToken()),

  markAllAsRead: () =>
    api<{ success: boolean }>("/notifications/read-all", { method: "PATCH" }, getToken()),
};
