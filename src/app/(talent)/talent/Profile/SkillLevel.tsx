"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import type { SkillsAndDocumentsInfo } from "@/lib/types/Profile";

const inputStyles =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#8A38F5] sm:py-3";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

interface SkillsAndDocumentsProps {
  value: SkillsAndDocumentsInfo;
  onChange: (next: SkillsAndDocumentsInfo) => void;
}

export function SkillsAndDocuments({ value, onChange }: SkillsAndDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const updateSkill = (index: number, skillValue: string) => {
    const next = value.skills.map((s, i) => (i === index ? skillValue : s));
    onChange({ ...value, skills: next });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      // Note: capped tighter than the visual "5MB" copy below, since this
      // gets base64-encoded (~33% larger) and shares localStorage's small
      // total budget with the rest of the profile, including the photo.
      setFileError("For this local demo, please keep CVs under 1.5MB — larger files may not save.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        ...value,
        cv: { fileName: file.name, dataUrl: reader.result as string, sizeBytes: file.size },
      });
    };
    reader.readAsDataURL(file);
  };

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
        <label className="mb-2 block text-xs font-medium text-gray-900 sm:text-sm">CV / Resume</label>

        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center sm:px-6 sm:py-8">
          {value.cv ? (
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="shrink-0 text-[#8A38F5] sm:size-5" />
                <span className="max-w-[200px] truncate text-xs font-medium text-gray-900 sm:max-w-none sm:text-sm">
                  {value.cv.fileName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onChange({ ...value, cv: null })}
                aria-label="Remove file"
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 sm:text-sm">
                No file uploaded yet (PDF or Word, under 1.5MB for now)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#EDE7F8] px-4 py-2 text-xs font-semibold text-[#8A38F5] transition-colors hover:bg-[#DCCFF5] sm:px-5 sm:text-sm"
              >
                <Upload size={14} className="sm:size-[15px]" />
                Upload CV (PDF or Word)
              </button>
            </>
          )}
          {fileError && <p className="mt-2 text-xs text-red-500">{fileError}</p>}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}