"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { session as sessionStore } from "@/lib/auth/session";
import { companyProfileApi } from "@/lib/api/companyProfile";
import { employerJobsApi } from "@/lib/api/employerJob";
import type { CompanyProfile } from "@/lib/api/companyProfile";
import type { EmployerJob } from "@/lib/api/employerJob";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#8A38F5] sm:py-3";
const labelClass = "mb-1.5 block text-xs font-semibold text-gray-900 sm:text-sm";

function getInitial(name: string) {
  return name.trim()[0]?.toUpperCase() ?? "?";
}

const statusStyles: Record<EmployerJob["status"], string> = {
  active: "text-green-600",
  draft: "text-amber-600",
  closed: "text-red-500",
};

const statusLabels: Record<EmployerJob["status"], string> = {
  active: "Active",
  draft: "Draft",
  closed: "Closed",
};

export default function CompanyProfilePage() {
  const { session } = useSession();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    if (!session?.email) return;
    const loaded = companyProfileApi.get(session.email, session.displayName ?? "Company");
    setProfile(loaded);
    setJobs(employerJobsApi.getAll(session.email));
  }, [session?.email]);

  function openEdit() {
    if (!profile) return;
    setDraft(profile);
    setEditing(true);
  }

  function handleSave() {
    if (!session?.email || !draft) return;
    companyProfileApi.save(session.email, draft);
    setProfile(draft);
    sessionStore.set({ ...session, displayName: draft.companyName || session.displayName });
    setEditing(false);
  }

  if (!profile) return null;

  const activeJobs = jobs.filter((j) => j.status !== "draft");

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">Company Profile</h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Manage your organization branding and public page details.
          </p>
        </div>
        <button
          type="button"
          onClick={openEdit}
          className="shrink-0 self-start rounded-xl border border-[#8A38F5] px-4 py-2 text-xs font-semibold text-[#8A38F5] transition-colors hover:bg-[#EDE7F8] sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Edit Profile
        </button>
      </div>

      {/* Company header card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EDE7F8] text-xl font-bold text-[#8A38F5] sm:h-16 sm:w-16 sm:text-2xl">
            {getInitial(profile.companyName)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">{profile.companyName}</h2>
              {profile.verified && (
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 sm:text-xs">
                  <Check size={11} />
                  Verified Employer
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 sm:text-sm">
              {profile.industry && (
                <span>
                  Industry: <span className="font-semibold text-gray-900">{profile.industry}</span>
                </span>
              )}
              {profile.location && (
                <span>
                  Location: <span className="font-semibold text-gray-900">{profile.location}</span>
                </span>
              )}
              {profile.website && (
                <span>
                  Website:{" "}
                  <a href={`https://${profile.website.replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer" className="font-semibold text-[#8A38F5] hover:underline">
                    {profile.website}
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About + Contact */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 lg:col-span-2">
          <h2 className="text-sm font-bold text-gray-900">About Company</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {profile.about || "No company description added yet."}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-bold text-gray-900">Contact Information</h2>
          <div className="mt-3 flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">Email Address</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">{profile.contactEmail}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">Office Address</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {profile.officeAddress || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-gray-900 sm:text-base">
          Open Positions ({activeJobs.length})
        </h2>
        {activeJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
            No open positions yet.{" "}
            <Link href="/employer/jobs/new" className="font-semibold text-[#8A38F5] hover:underline">
              Post a job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeJobs.map((job) => (
              <Link
                key={job.id}
                href="/employer/jobs"
                className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md sm:p-5"
              >
                <p className="text-sm font-semibold text-gray-900">{job.title}</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {job.location} · {job.workMode}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-[#EDE7F8] px-2.5 py-1 text-[11px] font-medium text-[#8A38F5]">
                    {job.applicants} Applicants
                  </span>
                  <span className={`text-xs font-semibold ${statusStyles[job.status]}`}>
                    {statusLabels[job.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">Edit Company Profile</h3>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  value={draft.companyName}
                  onChange={(e) => setDraft({ ...draft, companyName: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Industry</label>
                  <input
                    type="text"
                    value={draft.industry}
                    onChange={(e) => setDraft({ ...draft, industry: e.target.value })}
                    placeholder="e.g. Information Technology"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    value={draft.location}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    placeholder="e.g. Lagos, Nigeria"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Website</label>
                <input
                  type="text"
                  value={draft.website}
                  onChange={(e) => setDraft({ ...draft, website: e.target.value })}
                  placeholder="e.g. www.yourcompany.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>About Company</label>
                <textarea
                  value={draft.about}
                  onChange={(e) => setDraft({ ...draft, about: e.target.value })}
                  rows={4}
                  placeholder="Tell candidates about your company..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Contact Email</label>
                  <input
                    type="email"
                    value={draft.contactEmail}
                    onChange={(e) => setDraft({ ...draft, contactEmail: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Office Address</label>
                  <input
                    type="text"
                    value={draft.officeAddress}
                    onChange={(e) => setDraft({ ...draft, officeAddress: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={draft.verified}
                  onChange={(e) => setDraft({ ...draft, verified: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#8A38F5] focus:ring-[#8A38F5]/30"
                />
                Verified Employer
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-xl bg-[#8A38F5] py-2.5 text-sm font-semibold text-white hover:bg-[#7226e0]"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}