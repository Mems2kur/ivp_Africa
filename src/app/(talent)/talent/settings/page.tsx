"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff } from "lucide-react";
import { manrope, plusJakartaSans } from "@/app/font";
import { api } from "@/lib/api/client";
import { useSession } from "@/lib/auth/useSession";
import { session as sessionStore } from "@/lib/auth/session";
import { settingsApi } from "@/lib/api/settings";

const inputStyles = `w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#8A38F5] ${plusJakartaSans.className}`;

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputStyles}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function PreferenceCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
        checked ? "bg-[#8A38F5]" : "border border-gray-300 bg-white"
      }`}
    >
      {checked && <Check size={15} strokeWidth={3} className="text-white" />}
    </button>
  );
}

export default function SettingsPage() {
  const { session } = useSession();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "success">("idle");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [emailApplicationUpdates, setEmailApplicationUpdates] = useState(true);
  const [emailJobMatches, setEmailJobMatches] = useState(true);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // load saved preferences once we know who's logged in
  useEffect(() => {
    if (!session?.email) return;
    const prefs = settingsApi.getPreferences(session.email);
    setEmailApplicationUpdates(prefs.emailApplicationUpdates);
    setEmailJobMatches(prefs.emailJobMatches);
  }, [session?.email]);

  async function handleUpdatePassword() {
    if (!session?.email) return;
    setPasswordError(null);

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in both fields.");
      return;
    }

    setPasswordStatus("saving");
    const result = await api.auth.changePassword(session.email, currentPassword, newPassword);
    setPasswordStatus("idle");

    if (!result.ok) {
      if (result.reason === "incorrect_current_password") {
        setPasswordError("Current password is incorrect.");
      } else if (result.reason === "weak_password") {
        setPasswordError("New password must be at least 8 characters.");
      } else {
        setPasswordError("Something went wrong. Please try again.");
      }
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setPasswordStatus("success");
    setTimeout(() => setPasswordStatus("idle"), 2000);
  }

  function handleToggleApplicationUpdates() {
    if (!session?.email) return;
    const next = !emailApplicationUpdates;
    setEmailApplicationUpdates(next);
    settingsApi.savePreferences(session.email, {
      emailApplicationUpdates: next,
      emailJobMatches,
    });
  }

  function handleToggleJobMatches() {
    if (!session?.email) return;
    const next = !emailJobMatches;
    setEmailJobMatches(next);
    settingsApi.savePreferences(session.email, {
      emailApplicationUpdates,
      emailJobMatches: next,
    });
  }

  async function handleDeleteAccount() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    if (!session?.email) return;

    setDeleting(true);
    await api.auth.deleteAccount(session.email);
    sessionStore.clear();
    router.push("/login");
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <h1 className={`text-2xl font-bold text-black ${manrope.className}`}>Settings</h1>

      {/* Change password */}
      <div className="shadow-[0_1px_2px_rgba(16,15,20,0.04),0_16px_32px_-24px_rgba(16,15,20,0.12)] rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className={`text-lg font-bold text-gray-900 ${manrope.className}`}>
          Change password
        </h2>

        <div className="mt-5 flex flex-col gap-3">
          <PasswordInput
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Current password"
          />
          <PasswordInput
            value={newPassword}
            onChange={setNewPassword}
            placeholder="New password"
          />
        </div>

        {passwordError && (
          <p className="mt-3 text-sm text-red-500">{passwordError}</p>
        )}

        <button
          type="button"
          onClick={handleUpdatePassword}
          disabled={passwordStatus === "saving"}
          className={`mt-5 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 ${manrope.className}`}
        >
          {passwordStatus === "saving"
            ? "Updating…"
            : passwordStatus === "success"
              ? "Password updated ✓"
              : "Update password"}
        </button>
      </div>

      {/* Notification preferences */}
      <div className="shadow-[0_1px_2px_rgba(16,15,20,0.04),0_16px_32px_-24px_rgba(16,15,20,0.12)] rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className={`text-lg font-bold text-gray-900 ${manrope.className}`}>
          Notification preferences
        </h2>

        <div className="mt-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className={`text-sm text-gray-700 ${plusJakartaSans.className}`}>
              Email me about application updates
            </p>
            <PreferenceCheckbox
              checked={emailApplicationUpdates}
              onChange={handleToggleApplicationUpdates}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className={`text-sm text-gray-700 ${plusJakartaSans.className}`}>
              Email me new job matches
            </p>
            <PreferenceCheckbox
              checked={emailJobMatches}
              onChange={handleToggleJobMatches}
            />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="shadow-[0_1px_2px_rgba(16,15,20,0.04),0_16px_32px_-24px_rgba(16,15,20,0.12)] rounded-2xl border border-red-100 bg-white p-6">
        <h2 className={`text-lg font-bold text-[#C94F3D] ${manrope.className}`}>
          Danger zone
        </h2>
        <p className={`mt-2 text-sm text-gray-500 ${plusJakartaSans.className}`}>
          Deleting your account is permanent and cannot be undone.
        </p>

        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleting}
          className={`mt-5 rounded-xl bg-red-50 px-6 py-3 text-sm font-semibold text-[#C94F3D] transition-colors hover:bg-red-100 disabled:opacity-50 ${manrope.className}`}
        >
          {deleting ? "Deleting…" : confirmingDelete ? "Click again to confirm" : "Delete account"}
        </button>

        {confirmingDelete && !deleting && (
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className={`mt-5 ml-3 rounded-xl px-6 py-3 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 ${manrope.className}`}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}