import type { AdminProfileData } from "@/lib/types/adminProfile";

const PREFIX = "ivp_admin_profile_";

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

export const adminProfileApi = {
  get(email: string): AdminProfileData | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(keyFor(email));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save(email: string, data: AdminProfileData) {
    localStorage.setItem(keyFor(email), JSON.stringify(data));
  },
};