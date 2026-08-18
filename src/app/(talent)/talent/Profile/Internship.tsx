"use client";

import { Check, ChevronDown } from "lucide-react";
import type { InternshipPreferencesInfo } from "@/lib/types/Profile";

const roleOptions = [
  "Software Development",
  "Data Analysis",
  "Product Design (UI/UX)",
  "Digital Marketing",
  "Graphic Design",
  "Content Writing",
  "Human Resources",
  "Finance & Accounting",
  "Sales & Business Development",
  "Customer Service",
  "Project Management",
  "Engineering",
  "Agriculture & Agribusiness",
  "Healthcare & Medical",
];

const durationOptions = ["1-3 months", "3-6 months", "6+ months"];
const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const availabilityOptions = ["Immediate", "2 weeks notice", "1 month notice", "Flexible"];

const inputStyles =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#8A38F5]";

function RoleCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
        checked ? "border-gray-200 text-gray-900" : "border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? "border-[#8A38F5] bg-[#8A38F5]" : "border-gray-300 bg-white"
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} className="text-white" />}
      </span>
      {label}
    </button>
  );
}

interface InternshipPreferencesProps {
  value: InternshipPreferencesInfo;
  onChange: (next: InternshipPreferencesInfo) => void;
}

export function InternshipPreferences({ value, onChange }: InternshipPreferencesProps) {
  const toggleRole = (role: string) => {
    const nextRoles = value.selectedRoles.includes(role)
      ? value.selectedRoles.filter((r) => r !== role)
      : [...value.selectedRoles, role];
    onChange({ ...value, selectedRoles: nextRoles });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">Employment preferences</h2>
      <p className="mt-1 text-sm text-gray-500">Select all roles you&apos;d consider.</p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roleOptions.map((role) => (
          <RoleCheckbox
            key={role}
            label={role}
            checked={value.selectedRoles.includes(role)}
            onChange={() => toggleRole(role)}
          />
        ))}
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-gray-900">Preferred duration</label>
        <div className="grid grid-cols-3 gap-3">
          {durationOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange({ ...value, duration: option })}
              className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
                value.duration === option
                  ? "bg-[#8A38F5] text-white"
                  : "border border-gray-200 text-gray-900 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Preferred job type</label>
          <div className="relative">
            <select
              value={value.preferredJobType}
              onChange={(e) => onChange({ ...value, preferredJobType: e.target.value })}
              className={`${inputStyles} appearance-none pr-10`}
            >
              <option value="">Select job type</option>
              {jobTypeOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Preferred location</label>
          <input
            type="text"
            placeholder="e.g. Remote, Lagos, Nigeria"
            value={value.preferredLocation}
            onChange={(e) => onChange({ ...value, preferredLocation: e.target.value })}
            className={inputStyles}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Expected salary</label>
          <input
            type="text"
            placeholder="e.g. NGN 800,000 / month"
            value={value.expectedSalary}
            onChange={(e) => onChange({ ...value, expectedSalary: e.target.value })}
            className={inputStyles}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Availability</label>
          <div className="relative">
            <select
              value={value.availability}
              onChange={(e) => onChange({ ...value, availability: e.target.value })}
              className={`${inputStyles} appearance-none pr-10`}
            >
              <option value="">Select availability</option>
              {availabilityOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}