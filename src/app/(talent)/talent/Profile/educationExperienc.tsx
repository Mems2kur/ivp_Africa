"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
          value
            ? "bg-[#8A38F5] text-white"
            : "border border-gray-200 text-gray-900 hover:bg-gray-50"
        }`}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
          !value
            ? "bg-[#8A38F5] text-white"
            : "border border-gray-200 text-gray-900 hover:bg-gray-50"
        }`}
      >
        {noLabel}
      </button>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <label className="mb-2 block text-sm font-medium text-gray-900">{label}</label>
      {children}
    </div>
  );
}

const inputStyles =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#8A38F5]";

export function EducationSection() {
  const [educationLevel, setEducationLevel] = useState("Undergraduate");
  const [courseOfStudy, setCourseOfStudy] = useState("Computer Science");
  const [institution, setInstitution] = useState("University of Lagos");
  const [currentlyInSchool, setCurrentlyInSchool] = useState(true);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">2. Education</h2>

      <FormField label="Education level">
        <div className="relative">
          <select
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
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

      <FormField label="Course of study">
        <input
          type="text"
          value={courseOfStudy}
          onChange={(e) => setCourseOfStudy(e.target.value)}
          className={inputStyles}
        />
      </FormField>

      <FormField label="Institution name">
        <input
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className={inputStyles}
        />
      </FormField>

      <FormField label="Currently in school?">
        <YesNoToggle value={currentlyInSchool} onChange={setCurrentlyInSchool} />
      </FormField>
    </div>
  );
}

export function ExperienceSection() {
  const [hasInternship, setHasInternship] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">5. Experience</h2>

      <FormField label="Have you done an internship before?">
        <YesNoToggle value={hasInternship} onChange={setHasInternship} />
      </FormField>
    </div>
  );
}

export function EducationExperienceGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <EducationSection />
      <ExperienceSection />
    </div>
  );
}