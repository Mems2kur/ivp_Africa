"use client";

import { useState, useEffect } from "react";

interface PlatformSettings {
  otpExpiryMinutes: string;
  maxUploadSizeCv: string;
  maxUploadSizeLogo: string;
  passwordPolicy: string;
}

const STORAGE_KEY = "ivp_admin_platform_settings";

const defaultSettings: PlatformSettings = {
  otpExpiryMinutes: "10 Minutes",
  maxUploadSizeCv: "8MB",
  maxUploadSizeLogo: "3 MB",
  passwordPolicy: "Min 8 chars, upper, lower, number, symbol",
};

function loadSettings(): PlatformSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

const inputClass = "w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#8A38F5] focus:bg-white";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Settings</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">System configuration.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Platform Defaults</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5">
          <div>
            <label className={labelClass}>OTP Expiry Duration</label>
            <select
              value={settings.otpExpiryMinutes}
              onChange={(e) => setSettings({ ...settings, otpExpiryMinutes: e.target.value })}
              className={inputClass}
            >
              <option>5 Minutes</option>
              <option>10 Minutes</option>
              <option>15 Minutes</option>
              <option>30 Minutes</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Max Upload Size CV</label>
            <select
              value={settings.maxUploadSizeCv}
              onChange={(e) => setSettings({ ...settings, maxUploadSizeCv: e.target.value })}
              className={inputClass}
            >
              <option>2MB</option>
              <option>5MB</option>
              <option>8MB</option>
              <option>10MB</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Max Upload Size Logo</label>
            <select
              value={settings.maxUploadSizeLogo}
              onChange={(e) => setSettings({ ...settings, maxUploadSizeLogo: e.target.value })}
              className={inputClass}
            >
              <option>1 MB</option>
              <option>2 MB</option>
              <option>3 MB</option>
              <option>5 MB</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Password Policy</label>
            <input
              type="text"
              value={settings.passwordPolicy}
              onChange={(e) => setSettings({ ...settings, passwordPolicy: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-[#8A38F5] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0]"
          >
            {saveStatus === "saved" ? "Saved ✓" : "Save Settings"}
          </button>
        </div>
      </div>
    </>
  );
}