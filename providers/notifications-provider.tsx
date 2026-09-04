"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/providers/auth-provider";
import { notificationApi } from "@/lib/api/notifications";
import type { Notification } from "@/lib/types/notification";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  refreshNotifications: async () => {},
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const data = await notificationApi.list({ limit: 20 });
      const rawList = data.notifications ?? [];
      const normalized = rawList.map((n) => ({
        ...n,
        isRead: typeof n.isRead === "boolean" ? n.isRead : Boolean(n.readAt),
      }));
      setNotifications(normalized);
      setUnreadCount(data.unreadCount ?? normalized.filter((n) => !n.isRead).length);
    } catch {
      // Fail silently for background polling
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch + Polling every 25 seconds while app is open & user logged in
  useEffect(() => {
    if (!user) return;
    refreshNotifications();
    const interval = setInterval(() => {
      refreshNotifications();
    }, 25000);
    return () => clearInterval(interval);
  }, [user, refreshNotifications]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await notificationApi.markAsRead(id);
    } catch {
      // Revert if API fails
      refreshNotifications();
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await notificationApi.markAllAsRead();
    } catch {
      refreshNotifications();
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
