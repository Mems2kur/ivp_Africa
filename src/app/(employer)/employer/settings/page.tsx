"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, Bell, Shield, Users } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { session as sessionStore } from "@/lib/auth/session";
import { api } from "@/lib/api/client";
import { employerSettingsApi , EmployerProfileSettings, EmployerAccountSettings } from "@/lib/api/employerSettings";

type TabValue = "profile" | "account" | "notifications" | "security" | "team";

const tabs: { value: TabValue; label: string; icon: typeof User }[] = [
  { value: "profile", label: "Profile", icon: User },
  { value: "account", label: "Account", icon: Building2 },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "security", label: "Security", icon: Shield },
  { value: "team", label: "Team", icon: Users },
];

const inputClass =
  "w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#8A38F5] focus:bg-white sm:py-3";
const labelClass = "mb-1.5 block text-xs font-semibold text-gray-900 sm:text-sm";

function getInitials(name: string) {
  if (!name?.trim()) return "?";
  return name.trim().split(/\s+/).map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#8A38F5]" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-0.6" : "-translate-x-5"
        }`}
      />
    </button>
  );
}

export default function EmployerSettingsPage() {
  const { session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabValue>("profile");
  const [profile, setProfile] = useState<EmployerProfileSettings | null>(null);
  const [account, setAccount] = useState<EmployerAccountSettings | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "success">("idle");

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!session?.email) return;
    setProfile(employerSettingsApi.getProfile(session.email, session.displayName ?? "Employer"));
    setAccount(employerSettingsApi.getAccount(session.email));
  }, [session?.email]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    if (file.size > 1_000_000) {
      alert("Please choose an image under 1MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    if (!profile) return;
    setProfile({ ...profile, avatarUrl: undefined });
  }

  function handleSaveProfile() {
    if (!session?.email || !profile) return;
    employerSettingsApi.saveProfile(session.email, profile);
    sessionStore.set({
      ...session,
      displayName: `${profile.firstName} ${profile.lastName}`.trim() || session.displayName,
      avatarUrl: profile.avatarUrl,
    });
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }

  function handleSaveAccount(next: EmployerAccountSettings) {
    if (!session?.email) return;
    setAccount(next);
    employerSettingsApi.saveAccount(session.email, next);
  }

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
      setPasswordError(
        result.reason === "incorrect_current_password"
          ? "Current password is incorrect."
          : "New password must be at least 8 characters."
      );
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setPasswordStatus("success");
    setTimeout(() => setPasswordStatus("idle"), 2000);
  }

  async function handleDeleteAccount() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    if (!session?.email) return;
    await api.auth.deleteAccount(session.email);
    sessionStore.clear();
    router.push("/login");
  }

  if (!profile || !account) return null;

  return (
    <>
      <div>
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">Account Settings</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Control security thresholds, user directories, and preference panels.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        {/* Sub-nav */}
        <div className="h-full rounded-2xl border border-gray-100 bg-white p-2">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors lg:w-full ${
                    activeTab === tab.value
                      ? "bg-[#EDE7F8] text-[#8A38F5]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {activeTab === "profile" && (
            <>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">Personal Information</h2>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EDE7F8] text-lg font-semibold text-[#8A38F5]">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      getInitials(`${profile.firstName} ${profile.lastName}`)
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl bg-[#8A38F5] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#7226e0] sm:text-sm"
                    >
                      Upload New
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input type="email" value={profile.email} disabled className={`${inputClass} text-gray-400`} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+234 801 234 5678"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="mt-5 rounded-xl bg-[#8A38F5] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0]"
                >
                  {saveStatus === "saved" ? "Saved ✓" : "Save Changes"}
                </button>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">Notification Preferences</h2>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                      <p className="text-xs text-gray-400">Receive updates about candidates and applications in your inbox.</p>
                    </div>
                    <Toggle
                      checked={account.emailNotifications}
                      onChange={() => handleSaveAccount({ ...account, emailNotifications: !account.emailNotifications })}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application Updates</p>
                      <p className="text-xs text-gray-400">Get notified immediately when new talent applies to your posts.</p>
                    </div>
                    <Toggle
                      checked={account.applicationUpdates}
                      onChange={() => handleSaveAccount({ ...account, applicationUpdates: !account.applicationUpdates })}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-red-100 bg-white p-4 sm:p-6">
                <h2 className="text-sm font-bold text-red-600 sm:text-base">Danger Zone</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Permanently deactivate or delete your {profile.firstName ? `${profile.firstName}'s` : "your"} account.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="mt-4 rounded-xl bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                >
                  {confirmingDelete ? "Click again to confirm" : "Deactivate Account"}
                </button>
                {confirmingDelete && (
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="mt-4 ml-3 rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}

          {activeTab === "account" && (
            <>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">General Information</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      value={`${profile.firstName} ${profile.lastName}`.trim()}
                      onChange={(e) => {
                        const [firstName = "", ...rest] = e.target.value.split(" ");
                        setProfile({ ...profile, firstName, lastName: rest.join(" ") });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Email</label>
                    <input type="email" value={profile.email} disabled className={`${inputClass} text-gray-400`} />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-gray-400">Keep your enterprise recruiter seat protected from unverified logins.</p>
                  </div>
                  <Toggle
                    checked={account.twoFactorEnabled}
                    onChange={() => handleSaveAccount({ ...account, twoFactorEnabled: !account.twoFactorEnabled })}
                  />
                </div>

                <div className="mt-5 border-t border-gray-100 pt-5">
                  <p className="text-sm font-medium text-gray-900">Notification Preferences</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={account.applicationUpdates}
                        onChange={() => handleSaveAccount({ ...account, applicationUpdates: !account.applicationUpdates })}
                        className="h-4 w-4 rounded border-gray-300 text-[#8A38F5] focus:ring-[#8A38F5]/30"
                      />
                      Send email alerts for new candidates instantly
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={account.weeklyReport}
                        onChange={() => handleSaveAccount({ ...account, weeklyReport: !account.weeklyReport })}
                        className="h-4 w-4 rounded border-gray-300 text-[#8A38F5] focus:ring-[#8A38F5]/30"
                      />
                      Send weekly dashboard report compilation
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">Change Password</h2>
                <div className="mt-4 flex flex-col gap-3 sm:max-w-sm">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className={inputClass}
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className={inputClass}
                  />
                </div>
                {passwordError && <p className="mt-2 text-sm text-red-500">{passwordError}</p>}
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  disabled={passwordStatus === "saving"}
                  className="mt-4 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  {passwordStatus === "saving"
                    ? "Updating…"
                    : passwordStatus === "success"
                      ? "Password updated ✓"
                      : "Update password"}
                </button>
              </div>

              <div className="rounded-2xl border border-red-100 bg-white p-4 sm:p-6">
                <h2 className="text-sm font-bold text-red-600 sm:text-base">Danger Zone</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Deactivating your {profile.firstName ? `${profile.firstName}'s` : "your"} enterprise portal profile is irreversible.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="mt-4 rounded-xl border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  {confirmingDelete ? "Click again to confirm" : "Delete Account"}
                </button>
                {confirmingDelete && (
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="mt-4 ml-3 rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}

          {(activeTab === "notifications" || activeTab === "security" || activeTab === "team") && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <p className="text-sm text-gray-400">
                {tabs.find((t) => t.value === activeTab)?.label} settings coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}