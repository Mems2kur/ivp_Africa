import {
  MOCK_OTP,
  mockAuthAccounts,
} from "@/lib/api/mock/fixtures";

export const api = {
  auth: {
    registerCandidate: async (input: { firstName: string; lastName: string; email: string; password: string }) => {
      const exists = mockAuthAccounts.some(
        (a) => a.email.toLowerCase() === input.email.toLowerCase()
      );
      if (exists) {
        return { ok: false, reason: "email_exists" };
      }

      mockAuthAccounts.push({
        email: input.email,
        password: input.password,
        role: "Talent",
        emailVerified: false,
        redirectPath: "/talent",
        displayName: `${input.firstName} ${input.lastName}`,
      });

      return { ok: true };
    },
    verifyEmail: async (email: string, otp: string) => {
      if (otp !== MOCK_OTP) {
        return { ok: false, reason: "invalid_otp" };
      }

      const account = mockAuthAccounts.find(
        (a) => a.email.toLowerCase() === email.toLowerCase()
      );
      if (account) {
        account.emailVerified = true;
      }

      return { ok: true, redirectPath: "/talent" };
    },
    resendOtp: async (email: string) => {
      console.log(`[mock] resent OTP ${MOCK_OTP} to ${email}`);
      return { ok: true };
    },
  },
};