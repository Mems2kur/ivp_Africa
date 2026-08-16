import { MOCK_OTP, mockAuthAccounts, type AuthAccount } from "@/lib/api/mock/fixtures";
import { apiFetch } from "./httpClient";
const STORAGE_KEY = "ivp_mock_accounts";


export const realAuthApi = {
  registerCandidate: async (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    return apiFetch<{ message: string; userId: string }>("/api/v1/auth/register/talent", {
      method: "POST",
      body: JSON.stringify({ ...input, acceptTerms: true }),
    });
  },
  login: async (email: string, password: string) => {
  const result = await apiFetch<{
    access_token: string;
    user: { id: string; email: string; role: string };
  }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  const role = result.data.user.role.toLowerCase(); // backend sends "TALENT"/"EMPLOYER", app expects lowercase
  const redirectPath = role === "employer" ? "/employer" : role === "admin" ? "/admin" : "/talent";

  return {
    ok: true as const,
    accessToken: result.data.access_token,
    user: { id: result.data.user.id, email: result.data.user.email, role },
    redirectPath,
  };
  },
  requestPasswordReset: async(email:string) =>{
    const result = await apiFetch<{message: string}>("/api/v1/auth/password-reset/request",{
      method:"POST",
      body: JSON.stringify({email})
    });
  
    if(!result.ok){
      return {ok:false as const, message: result.message};
    }
    return {ok:true as const, message: result.data.message};

  },
  
  confirmPasswordReset: async(token : string, newPassword: string) =>{
    const result = await apiFetch<{message: string}>("/api/v1/auth/password-reset/confirm",{
      method:"POST",
      body: JSON.stringify({token, newPassword})
    });
  
    if(!result.ok){
      return {ok:false as const, message: result.message};
    }
    return {ok:true as const, message: result.data.message};
  },
};

function loadAccounts(): AuthAccount[] {
  if (typeof window === "undefined") return mockAuthAccounts;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : mockAuthAccounts;
  } catch {
    return mockAuthAccounts;
  }
}

function saveAccounts(accounts: AuthAccount[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export const api = {
  auth: {
  
   registerCandidate: async (input: { firstName: string; lastName: string; email: string; password: string }) => {
  const accounts = loadAccounts();
  const exists = accounts.some((a) => a.email.toLowerCase() === input.email.toLowerCase());
  if (exists) return { ok: false as const, reason: "email_exists" as const };

  accounts.push({
    id: crypto.randomUUID(), // ← new
    email: input.email,
    password: input.password,
    role: "talent",
    emailVerified: false,
    redirectPath: "/talent",
    displayName: `${input.firstName} ${input.lastName}`,
    createdAt: new Date().toISOString(),
  });

  saveAccounts(accounts);
  return { ok: true as const };
},

registerEmployer: async (input: { companyName: string; businessEmail: string; password: string }) => {
  const accounts = loadAccounts();
  const exists = accounts.some((a) => a.email.toLowerCase() === input.businessEmail.toLowerCase());
  if (exists) return { ok: false as const, reason: "email_exists" as const };

  accounts.push({
    id: crypto.randomUUID(), // ← new
    email: input.businessEmail,
    password: input.password,
    role: "employer",
    emailVerified: false,
    redirectPath: "/employer",
    displayName: input.companyName,
  });

  saveAccounts(accounts);
  return { ok: true as const };
},

    verifyEmail: async (email: string, otp: string) => {
      if (otp !== MOCK_OTP) {
        return { ok: false as const, reason: "invalid_otp" as const };
      }

      const accounts = loadAccounts();
      const account = accounts.find(
        (a) => a.email.toLowerCase() === email.toLowerCase()
      );
      if (!account) {
        return { ok: false as const, reason: "invalid_otp" as const };
      }

      account.emailVerified = true;
      saveAccounts(accounts);

      return { ok: true as const, redirectPath: account.redirectPath };
    },

    resendOtp: async (email: string) => {
      console.log(`[mock] resent OTP ${MOCK_OTP} to ${email}`);
      return { ok: true as const };
    },


    login: async (email: string, password: string) => {
      const accounts = loadAccounts();
      const account = accounts.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!account || account.password !== password) {
        return { ok: false as const, reason: "invalid_credentials" as const };
      }
      if (!account.emailVerified) {
        return { ok: false as const, reason: "unverified_email" as const };
      }
        account.lastLoginAt = new Date().toISOString(); // ← new
        saveAccounts(accounts);

      return {
        ok: true as const,
        user: {
          email: account.email,
          role: account.role,
          displayName: account.displayName,
        },
        redirectPath: account.redirectPath,
      };
    },

    changePassword: async (email: string, currentPassword: string, newPassword: string) => {
      const accounts = loadAccounts();
      const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

      if (!account) {
        return { ok: false as const, reason: "not_found" as const };
      }
      if (account.password !== currentPassword) {
        return { ok: false as const, reason: "incorrect_current_password" as const };
      }
      if (newPassword.length < 8) {
        return { ok: false as const, reason: "weak_password" as const };
      }

      account.password = newPassword;
      saveAccounts(accounts);
      return { ok: true as const };
    },

    deleteAccount: async (email: string) => {
      const accounts = loadAccounts();
      const remaining = accounts.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
      saveAccounts(remaining);

      const normalizedEmail = email.toLowerCase();
      localStorage.removeItem(`ivp_profile_${normalizedEmail}`);
      localStorage.removeItem(`ivp_applications_${normalizedEmail}`);
      localStorage.removeItem(`ivp_saved_jobs_${normalizedEmail}`);
      localStorage.removeItem(`ivp_notifications_${normalizedEmail}`);

      return { ok: true as const };
    },
  },
};