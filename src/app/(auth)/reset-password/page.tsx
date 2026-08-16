"use client";

import { Suspense, type FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { realAuthApi } from "@/lib/api/client";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or missing a token.");
      return;
    }
    if (!PASSWORD_RULE.test(password)) {
      setError("Min 8 characters, with upper, lower, number, and special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const result = await realAuthApi.confirmPasswordReset(token, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
        <h1 className="mt-4 text-xl font-bold text-[#3A2680]">Password reset!</h1>
        <p className="mt-2 text-sm text-[#6b5a94]">You can now log in with your new password.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-6 w-full rounded-xl bg-[#5A31C3] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4a2699]"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
      <h1 className="text-center text-2xl font-bold text-[#3A2680]">Set a new password</h1>
      <p className="mt-2 text-center text-sm text-[#6b5a94]">Choose a strong new password below.</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A38F5]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-white py-3.5 pr-11 pl-11 text-sm text-black placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A38F5]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-white py-3.5 pr-4 pl-11 text-sm text-black placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A31C3] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a2699] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Resetting…" : "Reset password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/login" className="font-semibold text-[#8A38F5] hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDE7F8] px-4">
      <Suspense fallback={<p className="text-sm text-gray-400">Loading…</p>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}