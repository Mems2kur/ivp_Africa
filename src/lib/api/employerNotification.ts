export type EmployerNotificationType = "application" | "interview" | "message" | "subscription";

export interface EmployerNotification {
  id: string;
  type: EmployerNotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

const PREFIX = "ivp_employer_notifications_";
type Listener = () => void;
const listeners = new Set<Listener>();

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

function readNotifications(email: string): EmployerNotification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(email)) ?? "[]");
  } catch {
    return [];
  }
}

function writeNotifications(email: string, notifications: EmployerNotification[]) {
  localStorage.setItem(keyFor(email), JSON.stringify(notifications));
  listeners.forEach((l) => l());
}

function seedNotifications(): EmployerNotification[] {
  const now = Date.now();
  return [
    { id: crypto.randomUUID(), type: "application", title: "New Application Received", description: "Uchechi Nwosu applied for Backend Engineer (Node.js)", createdAt: new Date(now - 10 * 60_000).toISOString(), read: false },
    { id: crypto.randomUUID(), type: "interview", title: "Interview Accepted", description: "Chinedu Okafor accepted the panel interview invitation.", createdAt: new Date(now - 1 * 3600_000).toISOString(), read: false },
    { id: crypto.randomUUID(), type: "message", title: "New Message", description: "Amina Yusuf sent a message regarding the data analyst test.", createdAt: new Date(now - 4 * 3600_000).toISOString(), read: true },
    { id: crypto.randomUUID(), type: "subscription", title: "Subscription Warning", description: "Your Professional plan renews in 7 days. Update card details if needed.", createdAt: new Date(now - 1 * 86400_000).toISOString(), read: true },
  ];
}

export const employerNotificationsApi = {
  getAll(email: string): EmployerNotification[] {
    const existing = readNotifications(email);
    if (existing.length > 0) {
      return existing.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const seeded = seedNotifications();
    writeNotifications(email, seeded);
    return seeded;
  },

  unreadCount(email: string): number {
    return readNotifications(email).filter((n) => !n.read).length;
  },

  markAsRead(email: string, id: string) {
    const notifications = readNotifications(email);
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    writeNotifications(email, updated);
  },

  markAllAsRead(email: string) {
    const notifications = readNotifications(email);
    const updated = notifications.map((n) => ({ ...n, read: true }));
    writeNotifications(email, updated);
  },

  remove(email: string, id: string) {
    const notifications = readNotifications(email);
    writeNotifications(email, notifications.filter((n) => n.id !== id));
  },

  add(email: string, type: EmployerNotificationType, title: string, description: string) {
    const notifications = readNotifications(email);
    notifications.unshift({
      id: crypto.randomUUID(),
      type,
      title,
      description,
      createdAt: new Date().toISOString(),
      read: false,
    });
    writeNotifications(email, notifications);
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};