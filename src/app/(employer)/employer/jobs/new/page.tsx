"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { employerJobsApi } from "@/lib/api/employerJob";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#8A38F5] sm:py-3";
const labelClass = "mb-1.5 block text-xs font-semibold text-gray-900 sm:text-sm";

function PostJobContent() {
  const { session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("id");
  const isEditMode = Boolean(editId);

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillDraft, setSkillDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loaded, setLoaded] = useState(!isEditMode);

  useEffect(() => {
    if (!isEditMode || !session?.email || !editId) return;
    const job = employerJobsApi.getById(session.email, editId);
    if (!job) {
      setNotFound(true);
      return;
    }
    setTitle(job.title);
    setDepartment(job.department);
    setDescription(job.description ?? "");
    setMinSalary(job.minSalary ?? "");
    setMaxSalary(job.maxSalary ?? "");
    setLocation(job.location);
    setDeadline(job.deadline ?? "");
    setEmploymentType(job.workMode);
    setSkills(job.skills ?? []);
    setLoaded(true);
  }, [isEditMode, session?.email, editId]);

  function handleAddSkill(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && skillDraft.trim()) {
      e.preventDefault();
      if (!skills.includes(skillDraft.trim())) {
        setSkills([...skills, skillDraft.trim()]);
      }
      setSkillDraft("");
    }
  }

  function handleRemoveSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  async function handleSubmit(status?: "active" | "draft") {
    if (!session?.email) return;
    setError(null);

    if (!title.trim() || !location.trim()) {
      setError("Job title and location are required.");
      return;
    }

    setSaving(true);

    const payload = {
      title: title.trim(),
      department: department.trim() || "General",
      description: description.trim(),
      minSalary: minSalary.trim(),
      maxSalary: maxSalary.trim(),
      location: location.trim(),
      deadline: deadline.trim(),
      workMode: employmentType.trim() || "Full-time",
      skills,
    };

    if (isEditMode && editId) {
      employerJobsApi.update(session.email, editId, payload);
    } else {
      employerJobsApi.create(session.email, { ...payload, status: status ?? "active" });
    }

    setSaving(false);
    router.push("/employer/jobs");
  }

  if (notFound) {
    return (
      <div>
        <Link href="/employer/jobs" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Job Postings
        </Link>
        <p className="mt-4 text-sm text-gray-400">No job found with this ID.</p>
      </div>
    );
  }

  if (!loaded) return null;

  return (
    <>
      <div>
        <p className="text-xs text-gray-400 sm:text-sm">
          <Link href="/employer/jobs" className="hover:text-gray-600">Job Postings</Link>
          {" > "}
          <span className="font-semibold text-[#8A38F5]">Post a Job</span>
        </p>
        <h1 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
          Post a New Job
        </h1>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 md:p-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Department/Category</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering / Product"
              className={inputClass}
            />
          </div>

          <div className="md:row-span-2">
            <label className={labelClass}>Job Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail job responsibilities and ideal background criteria..."
              rows={6}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Min Salary</label>
              <input
                type="text"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="$ Min"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Max Salary</label>
              <input
                type="text"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder="$ Max"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lagos, Nigeria / Remote"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Application Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Employment Type</label>
            <input
              type="text"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              placeholder="e.g. Full-time / Remote"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Required Skills</label>
            <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 focus-within:border-[#8A38F5] sm:min-h-[46px]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 rounded-full bg-[#EDE7F8] px-2.5 py-1 text-xs font-medium text-[#8A38F5]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#8A38F5] hover:text-[#6C3CFF]"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="+ Add skill"
                className="min-w-[80px] flex-1 bg-transparent text-xs text-gray-500 outline-none placeholder:text-gray-400 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          {isEditMode ? (
            <>
              <Link
                href="/employer/jobs"
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={saving}
                className="rounded-xl bg-[#8A38F5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0] disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("active")}
                disabled={saving}
                className="rounded-xl bg-[#8A38F5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0] disabled:opacity-50"
              >
                {saving ? "Publishing…" : "Publish Job"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Loading…</div>}>
      <PostJobContent />
    </Suspense>
  );
}