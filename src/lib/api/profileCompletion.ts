const PREFIX = "ivp_profile_completion_";

export interface ProfileCompletionState {
  profilePercent: number;
  isComplete: boolean;
}

export const profileCompletionApi = {
  get(email: string): ProfileCompletionState {
    if (typeof window === "undefined") return { profilePercent: 0, isComplete: false };
    try {
      const raw = localStorage.getItem(PREFIX + email.toLowerCase());
      return raw ? JSON.parse(raw) : { profilePercent: 0, isComplete: false };
    } catch {
      return { profilePercent: 0, isComplete: false };
    }
  },
  set(email: string, state: ProfileCompletionState) {
    localStorage.setItem(PREFIX + email.toLowerCase(), JSON.stringify(state));
  },
};