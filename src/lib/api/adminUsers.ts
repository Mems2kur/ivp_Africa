import type { AuthAccount } from "@/lib/api/mock/fixtures";
import { profileApi } from "@/lib/api/profile";
import { employerSettingsApi } from "@/lib/api/employerSettings";
const STORAGE_KEY = "ivp_mock_accounts";

function readAccounts(): AuthAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: AuthAccount[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export interface AdminUserView {
  id: string;
  email: string;
  displayName: string;
  role: "talent" | "employer" | "admin";
  status: "active" | "suspended";
  verification: "Verified" | "Unverified";
  flagged:boolean;
  createdAt?: string;
  lastLoginAt?: string;
  avatarUrl?: string;
}

function toView(account: AuthAccount): AdminUserView {
  const avatarUrl= account.role === "employer" ?
   employerSettingsApi.getProfile(account.email, account.displayName).avatarUrl 
   : profileApi.get(account.email)?.personalInfo.avatarUrl;
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    role: account.role,
    status: account.status ?? "active",
    verification: account.emailVerified ? "Verified" : "Unverified",
    flagged: account.flagged ?? false,
    createdAt: account.createdAt,
    lastLoginAt: account.lastLoginAt,
    avatarUrl, // Use avatar URL from profile if available
  };
}

export const adminUsersApi = {
  getAll(): AdminUserView[] {
    return readAccounts()
      .filter((a) => a.email.trim() !== "" && a.id) // skip legacy accounts with no id
      .map(toView);
  },

  getById(id: string): AdminUserView | null {
    const account = readAccounts().find((a) => a.id === id);
    return account ? toView(account) : null;
  },

  setStatus(id: string, status: "active" | "suspended") {
    const accounts = readAccounts();
    const updated = accounts.map((a) => (a.id === id ? { ...a, status } : a));
    writeAccounts(updated);
  },
  setFlag(id: string, flagged: boolean) {
    const accounts = readAccounts();
    const updated = accounts.map((a) => (a.id === id ? { ...a, flagged } : a));
    writeAccounts(updated);
  },
};