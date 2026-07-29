import type { NotificationRecord } from "@/lib/types/notification";

const PREFIX = "ivp_notifications_";
type Listener = () => void;
const listeners = new Set<Listener>();

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

function readList(email: string): NotificationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(email)) ?? "[]");
  } catch {
    return [];
  }
}

function writeList(email: string, list: NotificationRecord[]) {
  localStorage.setItem(keyFor(email), JSON.stringify(list));
  listeners.forEach((l) => l());
}

export const notificationsApi = {
  getAll(email: string): NotificationRecord[] {
    return readList(email).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  unreadCount(email: string): number {
    return readList(email).filter((n) => !n.read).length;
  },

  add(email: string, message: string) {
    const list = readList(email);
    const notification: NotificationRecord = {
      id: crypto.randomUUID(),
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    writeList(email, [notification, ...list]);
  },

  markAsRead(email: string, id: string) {
    const list = readList(email).map((n) => (n.id === id ? { ...n, read: true } : n));
    writeList(email, list);
  },

  markAllAsRead(email: string) {
    const list = readList(email).map((n) => ({ ...n, read: true }));
    writeList(email, list);
  },

 
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};