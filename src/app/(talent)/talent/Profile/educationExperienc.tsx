"use client";

import { ChevronDown } from "lucide-react";
import type { EducationInfo, ExperienceInfo } from "@/lib/types/Profile";

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}

function YesNoToggle({ value, onChange, yesLabel = "Yes", noLabel = "No" }: ToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
          value ? "bg-[#8A38F5] text-white" : "border border-gray-200 text-gray-900 hover:bg-gray-50"
        }`}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
          !value ? "bg-[#8A38F5] text-white" : "border border-gray-200 text-gray-900 hover:bg-gray-50"
        }`}
      >
        {noLabel}
      </button>
    </div>
  );
}

function FormField({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <label className="mb-2 block text-sm font-medium text-gray-900">{label}</label>
      {children}
    </div>
  );
}

function Required({ children }: { children: React.ReactNode }) {
  return (
    <span>
      {children} <span className="text-red-500">*</span>
    </span>
  );
}

const inputStyles =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#8A38F5]";

interface EducationSectionProps {
  value: EducationInfo;
  onChange: (next: EducationInfo) => void;
}

export function EducationSection({ value, onChange }: EducationSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">Education</h2>

      <FormField label="Education level">
        <div className="relative">
          <select
            value={value.educationLevel}
            onChange={(e) => onChange({ ...value, educationLevel: e.target.value })}
            className={`${inputStyles} appearance-none border-[#8A38F5] pr-10`}
          >
            <option>Undergraduate</option>
            <option>Postgraduate</option>
            <option>Diploma</option>
            <option>High school</option>
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
          />
        </div>
      </FormField>

      <FormField label={<Required>Course of study</Required>}>
        <input
          type="text"
          value={value.courseOfStudy}
          onChange={(e) => onChange({ ...value, courseOfStudy: e.target.value })}
          className={inputStyles}
        />
      </FormField>

      <FormField label={<Required>Start date</Required>}>
        <input
          type="date"
          value={value.startDate}
          onChange={(e) => onChange({ ...value, startDate: e.target.value })}
          className={inputStyles}
        />
      </FormField>

      <FormField label={<Required>Institution name</Required>}>
        <input
          type="text"
          value={value.institution}
          onChange={(e) => onChange({ ...value, institution: e.target.value })}
          className={inputStyles}
        />
      </FormField>
      

      <FormField label="Currently in school?">
        <YesNoToggle
          value={value.currentlyInSchool}
          onChange={(v) => onChange({ ...value, currentlyInSchool: v })}
        />
      </FormField>
      {!value.currentlyInSchool && (
  <FormField label="End date">
    <input
      type="date"
      value={value.endDate}
      onChange={(e) => onChange({ ...value, endDate: e.target.value })}
      className={inputStyles}
    />
  </FormField>
)}
    </div>
  );
}

interface ExperienceSectionProps {
  value: ExperienceInfo;
  onChange: (next: ExperienceInfo) => void;
}

export function ExperienceSection({ value, onChange }: ExperienceSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">Experience</h2>

      <FormField label="Have you done an internship before?">
        <YesNoToggle
          value={value.hasInternship}
          onChange={(v) => onChange({ ...value, hasInternship: v })}
        />
      </FormField>

      {value.hasInternship && (
        <>
          <FormField label={<Required>Company</Required>}>
            <input
              type="text"
              value={value.company}
              onChange={(e) => onChange({ ...value, company: e.target.value })}
              className={inputStyles}
            />
          </FormField>

          <FormField label={<Required>Role</Required>}>
            <input
              type="text"
              value={value.role}
              onChange={(e) => onChange({ ...value, role: e.target.value })}
              className={inputStyles}
            />
          </FormField>

          <FormField label={<Required>Start date</Required>}>
            <input
              type="date"
              value={value.startDate}
              onChange={(e) => onChange({ ...value, startDate: e.target.value })}
              className={inputStyles}
            />
          </FormField>
        </>
      )}
    </div>
  );
}

interface EducationExperienceGridProps {
  education: EducationInfo;
  onEducationChange: (next: EducationInfo) => void;
  experience: ExperienceInfo;
  onExperienceChange: (next: ExperienceInfo) => void;
}

export function EducationExperienceGrid({
  education,
  onEducationChange,
  experience,
  onExperienceChange,
}: EducationExperienceGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <EducationSection value={education} onChange={onEducationChange} />
      <ExperienceSection value={experience} onChange={onExperienceChange} />
    </div>
  );
}