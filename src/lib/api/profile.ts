import type { CandidateProfileData } from "@/lib/types/Profile";

const STORAGE_PREFIX = "ivp_profile_";

function keyFor(email: string) {
  return `${STORAGE_PREFIX}${email.toLowerCase()}`;
}

export const profileApi = {
  get(email: string): CandidateProfileData | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(keyFor(email));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save(email: string, data: CandidateProfileData) {
    localStorage.setItem(keyFor(email), JSON.stringify(data));
  },
};