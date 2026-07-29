export interface NotificationPreferences {
  emailApplicationUpdates: boolean;
  emailJobMatches: boolean;
}

const PREFIX = "ivp_notification_prefs_";

const defaultPreferences: NotificationPreferences = {
  emailApplicationUpdates: true,
  emailJobMatches: true,
};

export const settingsApi = {
  getPreferences(email: string): NotificationPreferences {
    if (typeof window === "undefined") return defaultPreferences;
    try {
      const raw = localStorage.getItem(PREFIX + email.toLowerCase());
      return raw ? JSON.parse(raw) : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  },
  savePreferences(email: string, prefs: NotificationPreferences) {
    localStorage.setItem(PREFIX + email.toLowerCase(), JSON.stringify(prefs));
  },
};