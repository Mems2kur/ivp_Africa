"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api/client";
import { RoleToggle } from "./RoleToggle";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  submit?: string;
}

const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

const inputClass =
  "w-full rounded-xl border border-gray-100 bg-white py-3.5 pr-4 pl-11 text-sm text-black placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5]";
const iconClass = "pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A38F5]";

type Step = "form" | "verify";

export default function SignUpFormSection() {
  const router = useRouter();
  const [role, setRole] = useState<"talent" | "employer">("talent");
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  function validate(): FormErrors {
    const errors: FormErrors = {};
    if (formData.firstName.trim().length < 2) {
      errors.firstName = "Enter at least 2 characters.";
    }
    if (formData.lastName.trim().length < 2) {
      errors.lastName = "Enter at least 2 characters.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!EMAIL_RULE.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!PASSWORD_RULE.test(formData.password)) {
      errors.password = "Min 8 characters, with upper, lower, number, and special character.";
    }
    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords don't match.";
    }
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must accept the Terms and Privacy Policy.";
    }
    return errors;
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    const errors = validate();
    setError(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const result = await api.auth.registerCandidate({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });
    setLoading(false);

    if (!result.ok) {
      setError({ submit: "An account already exists with this email address." });
      return;
    }

    setStep("verify");
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setOtpError(null);

    if (otp.trim().length !== 6) {
      setOtpError("Enter the full 6-digit code.");
      return;
    }

    setVerifying(true);
    const result = await api.auth.verifyEmail(formData.email.trim(), otp.trim());
    setVerifying(false);

    if (!result.ok) {
      setOtpError("Incorrect code. Please try again.");
      return;
    }

    router.push("/talent");
  }

  async function handleResend() {
    setResending(true);
    setResendMessage(null);
    await api.auth.resendOtp(formData.email.trim());
    setResending(false);
    setResendMessage("A new code has been sent.");
  }

  // ── Step 2: verify email ──
  if (step === "verify") {
    return (
      <div className="flex bg-[#EDE7F8] w-full flex-col items-center justify-center px-4 py-8 sm:px-8 lg:ml-[45%] lg:min-h-screen lg:py-12 xl:ml-[50%]">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl lg:p-10">
          <h1 className="text-2xl font-bold text-[#3A2680]">Verify your email</h1>
          <p className="mt-2 text-sm text-[#6b5a94]">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-[#3A2680]">{formData.email}</span>
          </p>

          <p className="mt-3 rounded-lg bg-[#EDE7F8] px-3 py-2 text-xs text-[#6b5a94]">
            Demo mode: use code <span className="font-mono font-semibold">123456</span>
          </p>

          <form onSubmit={handleVerify} className="mt-6">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-gray-200 py-3.5 text-center text-lg font-semibold tracking-[0.5em] text-black focus:outline-none focus:ring-2 focus:ring-[#8A38F5]"
            />
            {otpError && <p className="mt-2 text-xs text-red-500">{otpError}</p>}

            <button
              type="submit"
              disabled={verifying}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A31C3] py-3.5 text-base font-semibold text-white
                         transition-all duration-150 hover:bg-[#4a2699] active:scale-[0.98]
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verifying…
                </>
              ) : (
                "Verify email"
              )}
            </button>
          </form>

          <div className="mt-5 text-sm text-gray-500">
            {resendMessage ? (
              <p className="text-[#3A2680]">{resendMessage}</p>
            ) : (
              <>
                Didn&apos;t get a code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="font-semibold text-[#8A38F5] hover:underline disabled:opacity-50"
                >
                  {resending ? "Sending…" : "Resend code"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 1: sign-up form ──
  return (
    <div className="flex bg-[#EDE7F8] w-full flex-col items-center justify-center px-4 py-8 sm:px-8 lg:ml-[45%] lg:min-h-screen lg:py-12 xl:ml-[50%]">
      <div className="w-full bg-white max-w-md rounded-3xl  p-8 shadow-xl lg:p-10">
        <h1 className="text-center text-3xl font-bold text-black">Create Account</h1>
        <p className="mt-2 text-center text-sm text-black">
          Join IVP Africa and start applying to jobs and internships
        </p>

        <div className="mt-5">
          <RoleToggle value={role} onChange={setRole} />
        </div>

        {error.submit && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error.submit}
          </div>
        )}

        {role === "employer" ? (
          <div className="mt-8 rounded-xl border border-dashed border-gray-200 p-6 text-center">
            <p className="text-sm font-medium text-[#3A2680]">Employer sign-up is coming soon</p>
            <p className="mt-1 text-xs text-gray-500">
              We&apos;re still building this. Check back shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignUp} autoComplete="off" className=" mt-8 w-full space-y-4">
            <div className="flex flex-col gap-4">
              <div>
                <div className="relative">
                  <User className={iconClass} />
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                {error.firstName && <p className="mt-1.5 text-xs text-red-500">{error.firstName}</p>}
              </div>

              <div>
                <div className="relative">
                  <User className={iconClass} />
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                {error.lastName && <p className="mt-1.5 text-xs text-red-500">{error.lastName}</p>}
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className={iconClass} />
                <input
                  type="email"
                  id="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              {error.email && <p className="mt-1.5 text-xs text-red-500">{error.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className={iconClass} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  autoComplete="new-password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error.password && <p className="mt-1.5 text-xs text-red-500">{error.password}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className={iconClass} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">{error.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-gray-500">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-[#8A38F5] focus:ring-[#8A38F5]/30"
                />
                I agree to the{" "}
                <Link href="/terms" className="font-medium text-[#8A38F5] hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="font-medium text-[#8A38F5] hover:underline">
                  Privacy Policy
                </Link>
              </label>
              {error.agreeToTerms && <p className="mt-1 text-xs text-red-500">{error.agreeToTerms}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A31C3] py-3.5 text-base font-semibold text-white
                         transition-all duration-150 hover:bg-[#4a2699] active:scale-[0.98]
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account…
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#8A38F5] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}