"use client";

import { useState } from "react";
import { FileText, X } from "lucide-react";
import type { SkillsAndDocumentsInfo } from "@/lib/types/Profile";

const inputStyles =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#8A38F5] sm:py-3";

interface SkillsAndDocumentsProps {
  value: SkillsAndDocumentsInfo;
  onChange: (next: SkillsAndDocumentsInfo) => void;
}

export function SkillsAndDocuments({ value, onChange }: SkillsAndDocumentsProps) {
  const [certDraft, setCertDraft] = useState("");

  const updateSkill = (index: number, skillValue: string) => {
    const next = value.skills.map((s, i) => (i === index ? skillValue : s));
    onChange({ ...value, skills: next });
  };

  function handleAddCert(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && certDraft.trim()) {
      e.preventDefault();
      if (!value.certifications.includes(certDraft.trim())) {
        onChange({ ...value, certifications: [...value.certifications, certDraft.trim()] });
      }
      setCertDraft("");
    }
  }

  function handleRemoveCert(cert: string) {
    onChange({ ...value, certifications: value.certifications.filter((c) => c !== cert) });
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
      <h2 className="text-base font-bold text-gray-900 sm:text-lg">Skills & documents</h2>

      <div className="mt-4 sm:mt-5">
        <label className="mb-2 block text-xs font-medium text-gray-900 sm:text-sm">Top 3 skills</label>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {value.skills.map((skill, index) => (
            <input
              key={index}
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              placeholder={`Skill ${index + 1}`}
              className={inputStyles}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        <label className="mb-2 block text-xs font-medium text-gray-900 sm:text-sm">Certifications</label>
        <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 focus-within:border-[#8A38F5] sm:min-h-[46px]">
          {value.certifications.map((cert) => (
            <span
              key={cert}
              className="flex items-center gap-1 rounded-full bg-[#EDE7F8] px-2.5 py-1 text-xs font-medium text-[#8A38F5]"
            >
              {cert}
              <button
                type="button"
                onClick={() => handleRemoveCert(cert)}
                className="text-[#8A38F5] hover:text-[#6C3CFF]"
                aria-label={`Remove ${cert}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={certDraft}
            onChange={(e) => setCertDraft(e.target.value)}
            onKeyDown={handleAddCert}
            placeholder="Type a certification and press Enter"
            className="min-w-[160px] flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        <label className="mb-2 block text-xs font-medium text-gray-900 sm:text-sm">Portfolio link</label>
        <input
          type="url"
          value={value.portfolioLink}
          onChange={(e) => onChange({ ...value, portfolioLink: e.target.value })}
          placeholder="https://your-portfolio.com"
          className={inputStyles}
        />
      </div>

      <div className="mt-4 sm:mt-5">
        <label className="mb-2 block text-xs font-medium text-gray-900 sm:text-sm">CV / Resume link</label>
        <div className="relative">
          <FileText size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#8A38F5]" />
          <input
            type="url"
            value={value.resumeUrl}
            onChange={(e) => onChange({ ...value, resumeUrl: e.target.value })}
            placeholder="https://drive.google.com/your-resume.pdf"
            className={`${inputStyles} pl-11`}
          />
        </div>
      </div>
    </div>
  );
}