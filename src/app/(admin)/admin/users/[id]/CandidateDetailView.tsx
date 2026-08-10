"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone,  Globe, GraduationCap, Languages, Briefcase } from "lucide-react";
import { adminUsersApi, type AdminUserView } from "@/lib/api/adminUsers";
import { adminNotesApi } from "@/lib/api/adminNotes";
import { profileApi } from "@/lib/api/profile";
import { applicationsApi } from "@/lib/api/applications";
import {auditLogsApi} from "@/lib/api/auditLogs";

import { useSession } from "@/lib/auth/useSession";
type TabValue = "Overview" | "Resume" | "Skills" | "Activity" | "Admin Notes";
const tabs: TabValue[] = ["Overview", "Resume", "Skills", "Activity", "Admin Notes"];

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase()).slice(0, 2).join("");
}

export function CandidateDetailView({ user }: { user: AdminUserView }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>("Overview");
  const [current, setCurrent] = useState(user);
  const [note, setNote] = useState("");
  const { session } = useSession();
  // Pull real profile data if this candidate has one saved in this browser's storage
  const realProfile = profileApi.get(user.email);
  const realApplications = applicationsApi.getAll(user.email);

  useEffect(() => {
    setNote(adminNotesApi.get(user.id));
  }, [user.id]);

  function refresh() {
    const found = adminUsersApi.getById(user.id);
    if (found) setCurrent(found);
  }

  function handleToggleFlag() {
    adminUsersApi.setFlag(current.id, !current.flagged);
    refresh();
  }

  function handleToggleStatus() {
    const nextStatus = current.status === "active" ? "suspended" : "active";
    adminUsersApi.setStatus(current.id, nextStatus);
    auditLogsApi.add(
    session?.displayName ?? "Admin",
    nextStatus === "suspended" ? "Suspended account" : "Reactivated account",
    current.displayName
  );
    refresh();
  }

  function handleSaveNote() {
    adminNotesApi.save(user.id, note);
  }

  function formatDate(iso?: string) {
  if (!iso) return "Not available";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatRelative(iso?: string) {
  if (!iso) return "Never logged in";
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
  const skills = realProfile?.skillsAndDocuments?.skills.filter((s) => s.trim() !== "") ?? [];
  const education = realProfile?.education;
  const experience = realProfile?.experience;
  const cv = realProfile?.skillsAndDocuments?.cv;
  const completionPercent = realProfile
    ? Math.round(
        ([
          realProfile.personalInfo?.fullName,
          education?.institution,
          skills.length > 0,
          cv,
        ].filter(Boolean).length /
          4) *
          100
      )
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-400 sm:text-sm">
          <button onClick={() => router.push("/admin/users")} className="hover:text-gray-600">
            User management
          </button>
          {" > "}
          <span className="font-semibold text-[#8A38F5]">{current.displayName}</span>
        </p>
        <h1 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
          Candidate Profile Detail
        </h1>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EDE7F8] text-lg font-bold text-[#8A38F5] sm:h-16 sm:w-16">
                {realProfile?.personalInfo?.avatarUrl ? (
                  <img
                    src={realProfile.personalInfo.avatarUrl}
                    alt={current.displayName}
                    className="h-14 w-14 rounded-full object-cover sm:h-16 sm:w-16"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EDE7F8] text-lg font-bold text-[#8A38F5] sm:h-16 sm:w-16">
                    {getInitials(current.displayName)}
                  </div>
                )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">{current.displayName}</h2>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                  Available immediately
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                {realProfile?.personalInfo?.location || "Location not provided"}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Mail size={12} /> {current.email}
                </span>
                {realProfile?.personalInfo?.whatsapp && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> {realProfile.personalInfo.whatsapp}
                  </span>
                )}
                <span className="flex items-center gap-1 text-[#8A38F5]">
                  {/* <Linkedin size={12} /> LinkedIn */}
                </span>
                <span className="flex items-center gap-1 text-[#8A38F5]">
                  <Globe size={12} /> Portfolio
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <div className="flex gap-2">
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                {current.verification === "Verified" ? "✓ Verified" : "Unverified"}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  current.status === "active" ? "bg-[#EDE7F8] text-[#8A38F5]" : "bg-red-50 text-red-600"
                }`}
              >
                {current.status === "active" ? "Active Account" : "Suspended"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
                  current.flagged
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-[#8A38F5] text-[#8A38F5] hover:bg-[#EDE7F8]"
                }`}
              >
                {current.flagged ? "Unflag" : "Flag for Review"}
              </button>
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`rounded-xl px-3 py-2 text-xs font-semibold text-white transition-colors sm:px-4 sm:text-sm ${
                  current.status === "active" ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {current.status === "active" ? "Suspend Account" : "Reactivate"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-3 sm:gap-2 sm:px-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
                activeTab === tab ? "border-[#8A38F5] text-[#8A38F5]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
                <h3 className="text-sm font-bold text-gray-900">About Candidate</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {realProfile ? "Profile submitted by candidate." : "No about section provided yet."}
                </p>
                {education?.institution && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                      <GraduationCap size={13} /> Education & Credentials
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{education.courseOfStudy}</p>
                    <p className="text-xs text-gray-400">{education.institution}</p>
                  </div>
                )}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                    <Languages size={13} /> Languages
                  </p>
                  <p className="mt-1 text-sm text-gray-700">English Language (assumed)</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
                  <h3 className="text-sm font-bold text-gray-900">Key Skills & Competencies</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <span key={skill} className="rounded-full bg-[#EDE7F8] px-3 py-1 text-xs font-medium text-[#8A38F5]">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No skills listed yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                    <Briefcase size={14} /> Experience
                  </h3>
                  {experience?.hasInternship ? (
                    <p className="mt-2 text-sm text-gray-600">Has completed at least one internship.</p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">No prior internship experience recorded.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Resume" && (
            <div>
              {cv ? (
                <a
                  href={cv.dataUrl}
                  download={cv.fileName}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#EDE7F8] px-4 py-2.5 text-sm font-semibold text-[#8A38F5] hover:bg-[#DCCFF5]"
                >
                  Download {cv.fileName}
                </a>
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">No CV uploaded yet.</p>
              )}
            </div>
          )}

          {activeTab === "Skills" && (
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-[#EDE7F8] px-3 py-1.5 text-sm font-medium text-[#8A38F5]">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">No skills listed yet.</p>
              )}
            </div>
          )}

          {activeTab === "Activity" && (
            <div className="flex flex-col gap-2">
              {realApplications.length > 0 ? (
                realApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{app.jobTitle}</p>
                      <p className="text-xs text-gray-400">{app.company}</p>
                    </div>
                    <span className="text-xs text-gray-400">{app.status}</span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">No application activity found.</p>
              )}
            </div>
          )}

          {activeTab === "Admin Notes" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-900 sm:text-sm">
                Internal notes (only visible to admins)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={6}
                placeholder="Add internal notes about this candidate..."
                className="w-full resize-none rounded-xl border border-gray-200 p-4 text-sm text-gray-900 outline-none focus:border-[#8A38F5]"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                className="mt-3 rounded-xl bg-[#8A38F5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7226e0]"
              >
                Save note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Platform diagnostics */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h3 className="text-sm font-bold text-gray-900">Platform Diagnostics & Activity</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Account Created</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{formatDate(current.createdAt)}</p>
            </div>
            <div>
            <p className="text-[10px] text-gray-400 uppercase">Last Login Activity</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{formatRelative(current.lastLoginAt)}</p>
            </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Total Applications</p>
            <p className="mt-1 text-sm font-semibold text-[#8A38F5]">{realApplications.length} submissions</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Profile Completeness</p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                <div className="h-1.5 rounded-full bg-[#8A38F5]" style={{ width: `${completionPercent}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-900">{completionPercent}%</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Internal Verification</p>
            <p className="mt-1 text-sm font-semibold text-green-600">
              {current.verification === "Verified" ? "✓ Passed Verification" : "Pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}