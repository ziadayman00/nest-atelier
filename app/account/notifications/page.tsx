"use client";

import { useState } from "react";
import Link from "next/link";
import { useNotifications } from "@/providers/notifications-provider";
import { formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [filterUnread, setFilterUnread] = useState(false);

  const displayed = filterUnread ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="bento-card p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Private Inbox</span>
          <h1 className="font-display text-2xl sm:text-4xl text-[#161716] mt-1">
            Notifications & Alerts
          </h1>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Order tracking updates, verified review statuses, and studio communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
          <button
            type="button"
            onClick={() => setFilterUnread(!filterUnread)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer",
              filterUnread
                ? "bg-[#161716] text-white shadow-xs"
                : "bg-[#FAFAF7] border border-[#E2DCD2] text-[#6B7068] hover:border-[#161716] hover:text-[#161716]"
            )}
          >
            {filterUnread ? "Showing Unread" : "All Notifications"}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bento-card p-4 sm:p-6 space-y-4">
        <div className="pb-4 border-b border-[#E2DCD2] flex items-center justify-between">
          <span className="pill-accent-sage text-xs">Inbox Log ({displayed.length})</span>
          {unreadCount > 0 && (
            <span className="text-xs font-semibold text-[#4A5E4C]">
              {unreadCount} Unread Alerts
            </span>
          )}
        </div>

        {displayed.length > 0 ? (
          <ul className="divide-y divide-[#E2DCD2]">
            {displayed.map((n) => (
              <li
                key={n.id}
                onClick={() => {
                  if (!n.isRead) markAsRead(n.id);
                }}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl transition-all space-y-2 cursor-pointer",
                  !n.isRead ? "bg-[#FAFAF7] border-l-4 border-l-[#4A5E4C]" : "hover:bg-[#EDE7DC]/30 opacity-80"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="num-display-large text-lg text-[#161716]/40">
                      {n.type === "order_update" ? "📦" : n.type === "review_update" ? "★" : "🔔"}
                    </span>
                    <h3 className="font-display text-xl text-[#161716] font-semibold">{n.title}</h3>
                  </div>
                  <span className="text-xs text-[#6B7068]">{formatDate(n.createdAt)}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#6B7068] font-light leading-relaxed">
                  {n.message}
                </p>

                {n.link && (
                  <div className="pt-1">
                    <Link href={n.link} className="text-xs font-semibold text-[#4A5E4C] hover:underline">
                      Inspect related details ↗
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-16 text-center space-y-2">
            <p className="font-display text-2xl text-[#6B7068]">No notifications</p>
            <p className="text-xs text-[#6B7068] font-light">
              {filterUnread ? "No unread alerts in inbox" : "You have zero studio alerts"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
