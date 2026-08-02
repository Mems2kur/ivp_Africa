import type { AuthAccount } from "@/lib/api/mock/fixtures";

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
}

function toView(account: AuthAccount): AdminUserView {
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    role: account.role,
    status: account.status ?? "active",
    verification: account.emailVerified ? "Verified" : "Unverified",
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
};