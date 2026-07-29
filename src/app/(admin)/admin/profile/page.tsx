"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Eye, EyeOff, User, Mail, Phone } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { session as sessionStore } from "@/lib/auth/session";
import { adminProfileApi } from "@/lib/api/adminProfile";
import { emptyAdminProfile, type AdminProfileData } from "@/lib/types/adminProfile";
import { api } from "@/lib/api/client";

const inputClass =
  "w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-11 text-sm text-black placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5] focus:bg-white";
const iconClass = "pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A38F5]";
const labelClass = "mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase";

function PasswordField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
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
        className={`${inputClass} pr-11 pl-4`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function AdminProfilePage() {
  const { session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<AdminProfileData>(emptyAdminProfile);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "success">("idle");

  useEffect(() => {
    if (!session?.email) return;
    const existing = adminProfileApi.get(session.email);
    if (existing) {
      setProfile(existing);
    } else {
      setProfile({ ...emptyAdminProfile, email: session.email, fullName: session.displayName ?? "" });
    }
  }, [session?.email]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      alert("Please choose an image under 1MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function handleSaveProfile() {
    if (!session?.email) return;
    adminProfileApi.save(session.email, profile);
    sessionStore.set({
      ...session,
      displayName: profile.fullName || session.displayName,
      avatarUrl: profile.avatarUrl,
    });
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
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

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">My Profile</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Manage your admin account details and password.
        </p>
      </div>

      {/* Profile info */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#EDE7F8] text-lg font-semibold text-[#8A38F5]">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                profile.fullName?.[0]?.toUpperCase() ?? <User size={22} />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#8A38F5] text-white"
              aria-label="Change photo"
            >
              <Camera size={12} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Profile photo</p>
            <p className="text-xs text-gray-400">JPG or PNG, under 1MB</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Full name</label>
            <div className="relative">
              <User className={iconClass} />
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <Mail className={iconClass} />
              <input
                type="email"
                value={profile.email}
                disabled
                className={`${inputClass} text-gray-400`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <div className="relative">
              <Phone className={iconClass} />
              <input
                type="tel"
                placeholder="+234 801 234 5678"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Role</label>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
              Super Admin
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleSaveProfile}
            className="rounded-xl bg-[#8A38F5] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0]"
          >
            {saveStatus === "saved" ? "Saved ✓" : "Save changes"}
          </button>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h2 className="text-sm font-bold text-gray-900 sm:text-base">Change password</h2>

        <div className="mt-4 flex flex-col gap-3 sm:max-w-sm">
          <PasswordField value={currentPassword} onChange={setCurrentPassword} placeholder="Current password" />
          <PasswordField value={newPassword} onChange={setNewPassword} placeholder="New password" />
        </div>

        {passwordError && <p className="mt-3 text-sm text-red-500">{passwordError}</p>}

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
    </>
  );
}