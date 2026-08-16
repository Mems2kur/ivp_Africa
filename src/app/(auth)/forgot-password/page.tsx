"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { Mail, MailCheck } from "lucide-react";
import { realAuthApi } from "@/lib/api/client";

const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!EMAIL_RULE.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    const result = await realAuthApi.requestPasswordReset(email.trim());
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EDE7F8] px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE7F8]">
            <MailCheck className="h-7 w-7 text-[#8A38F5]" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-[#3A2680]">Check your email</h1>
          <p className="mt-2 text-sm text-[#6b5a94]">
            If an account exists for <span className="font-medium text-[#3A2680] break-all">{email}</span>,
            a password reset link has been sent.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block w-full rounded-xl bg-[#5A31C3] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4a2699]"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDE7F8] px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-[#3A2680]">Forgot password?</h1>
        <p className="mt-2 text-center text-sm text-[#6b5a94]">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A38F5]" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-white py-3.5 pr-4 pl-11 text-sm text-black placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A31C3] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a2699] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-[#8A38F5] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}