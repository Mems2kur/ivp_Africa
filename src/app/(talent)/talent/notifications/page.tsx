"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/useSession";
import { notificationsApi } from "@/lib/api/notification";
import type { NotificationRecord } from "@/lib/types/notification";

function formatTimeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export default function NotificationsPage() {
  const { session } = useSession();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  function refresh() {
    if (!session?.email) return;
    setNotifications(notificationsApi.getAll(session.email));
  }

  useEffect(() => {
    refresh();
  }, [session?.email]);

  function handleClick(notification: NotificationRecord) {
    if (!session?.email || notification.read) return;
    notificationsApi.markAsRead(session.email, notification.id);
    refresh();
  }

  function handleMarkAllRead() {
    if (!session?.email) return;
    notificationsApi.markAllAsRead(session.email);
    refresh();
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-black sm:text-2xl">Notifications</h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Stay updated on your applications and account activity.
          </p>
        </div>
        {hasUnread && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="shrink-0 text-xs font-semibold whitespace-nowrap text-[#8A38F5] hover:underline sm:text-sm"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center sm:p-10">
          <p className="text-xs text-gray-500 sm:text-sm">
            You&apos;re all caught up — no notifications yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleClick(notification)}
              className={`flex w-full items-start gap-2.5 border-b border-gray-100 px-4 py-3.5 text-left last:border-b-0 transition-colors sm:gap-3 sm:px-6 sm:py-5 ${
                !notification.read ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full sm:mt-2 sm:h-2 sm:w-2 ${
                  !notification.read ? "bg-[#8A38F5]" : "bg-transparent"
                }`}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                  {notification.message}
                </p>
                <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                  {formatTimeAgo(notification.createdAt)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}