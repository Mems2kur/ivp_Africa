const PREFIX = "ivp_admin_notes_";

export const adminNotesApi = {
  get(userId: string): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(PREFIX + userId) ?? "";
  },
  save(userId: string, note: string) {
    localStorage.setItem(PREFIX + userId, note);
  },
};