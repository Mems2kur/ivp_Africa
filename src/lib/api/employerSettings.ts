export interface EmployerProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface EmployerAccountSettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  applicationUpdates: boolean;
  weeklyReport: boolean;
}

const PROFILE_PREFIX = "ivp_employer_profile_settings_";
const ACCOUNT_PREFIX = "ivp_employer_account_settings_";

function profileKey(email: string) {
  return PROFILE_PREFIX + email.toLowerCase();
}
function accountKey(email: string) {
  return ACCOUNT_PREFIX + email.toLowerCase();
}

function defaultProfile(displayName: string, email: string): EmployerProfileSettings {
  const [firstName = "", ...rest] = displayName.split(" ");
  return { firstName, lastName: rest.join(" "), email, phone: "" };
}

const defaultAccount: EmployerAccountSettings = {
  twoFactorEnabled: false,
  emailNotifications: true,
  applicationUpdates: true,
  weeklyReport: false,
};

export const employerSettingsApi = {
  getProfile(email: string, fallbackName: string): EmployerProfileSettings {
    if (typeof window === "undefined") return defaultProfile(fallbackName, email);
    try {
      const raw = localStorage.getItem(profileKey(email));
      return raw ? JSON.parse(raw) : defaultProfile(fallbackName, email);
    } catch {
      return defaultProfile(fallbackName, email);
    }
  },

  saveProfile(email: string, profile: EmployerProfileSettings) {
    localStorage.setItem(profileKey(email), JSON.stringify(profile));
  },

  getAccount(email: string): EmployerAccountSettings {
    if (typeof window === "undefined") return defaultAccount;
    try {
      const raw = localStorage.getItem(accountKey(email));
      return raw ? JSON.parse(raw) : defaultAccount;
    } catch {
      return defaultAccount;
    }
  },

  saveAccount(email: string, account: EmployerAccountSettings) {
    localStorage.setItem(accountKey(email), JSON.stringify(account));
  },
};