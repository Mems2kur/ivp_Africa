"use client";

import { ShieldCheck, Briefcase, ClipboardList, ClipboardCheck } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";

const stats = [
  { icon: ShieldCheck, label: "Registered candidates", value: "8,204", filled: true },
  { icon: Briefcase, label: "Job applications", value: "24,910" },
  { icon: ClipboardList, label: "Active job postings", value: "312" },
  { icon: ClipboardCheck, label: "Pending verifications", value: "17" },
];

const recentApplications = [
  { id: 1, title: "Senior Product Designer", company: "AfriHealth", location: "Lagos, Nigeria", status: "Completed" as const },
  { id: 2, title: "Backend Engineer (Node.js)", company: "Kippa", location: "Accra, Ghana", status: "Completed" as const },
  { id: 3, title: "Clinical Officer", company: "Safiricom Health", location: "Nairobi", status: "Applied" as const },
  { id: 4, title: "Data Analyst", company: "Vantage Tech", location: "Cape Town", status: "Applied" as const },
];

const statusStyles: Record<"Completed" | "Applied", string> = {
  Completed: "bg-green-50 text-green-700",
  Applied: "bg-amber-50 text-amber-700",
};

const latestUpdates = [
  { id: 1, dot: "bg-green-500", text: "Recruiter 'AfriHealth' subscribed to Pro.", time: "10 mins ago" },
  { id: 2, dot: "bg-red-500", text: "Audit Alert: Configuration settings modified.", time: "1 hour ago" },
  { id: 3, dot: "bg-amber-500", text: "Candidate 'Ella ThankGod' completed profile verification.", time: "2 hours ago" },
];

export default function AdminDashboardPage() {
  const { session } = useSession();

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Welcome back, {session?.displayName ?? "Admin"}
        </h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Here&apos;s what&apos;s happening on the platform this week.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`group flex cursor-pointer items-center gap-3 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-6 ${
                stat.filled
                  ? "bg-gradient-to-br from-[#8E66FF] to-[#6C3CFF] text-white hover:shadow-[#6C3CFF]/30"
                  : "bg-[#F3EEFC] text-gray-900 hover:shadow-gray-200"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 sm:h-11 sm:w-11 ${
                  stat.filled ? "bg-white/20 group-hover:bg-white/30" : "bg-white group-hover:bg-[#8A38F5]"
                }`}
              >
                <Icon
                  size={17}
                  className={`transition-colors duration-200 sm:size-[19px] ${
                    stat.filled ? "text-white" : "text-[#8A38F5] group-hover:text-white"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold sm:text-xl">{stat.value}</p>
                <p className={`truncate text-xs sm:text-sm ${stat.filled ? "text-white/80" : "text-gray-500"}`}>
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent applications */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow duration-200 hover:shadow-md sm:p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 sm:text-base">Recent applications</h2>
            <button
              type="button"
              className="text-xs font-medium text-[#8A38F5] transition-colors hover:text-[#6C3CFF] hover:underline sm:text-sm"
            >
              View all
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 transition-colors duration-150 hover:bg-[#EDE7F8] sm:px-4 sm:py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">{app.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-gray-500 sm:text-xs">
                    {app.company} · {app.location}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap sm:px-3 sm:text-xs ${statusStyles[app.status]}`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow duration-200 hover:shadow-md sm:p-6">
          <h2 className="text-sm font-bold text-gray-900 sm:text-base">Platform summary</h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Admin operations are normal. 12 background jobs successfully processed today. 3 employers waiting for manual verifications.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-gray-100 pt-3 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">System Uptime</span>
              <span className="font-semibold text-green-600">99.98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Average Verification Turnaround</span>
              <span className="font-semibold text-gray-900">4.2 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended actions */}
      <div>
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Recommended actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow duration-200 hover:shadow-md sm:p-5">
            <p className="text-[11px] font-semibold tracking-wide text-[#8A38F5] uppercase sm:text-xs">Edit setup</p>
            <p className="mt-2 text-xs font-bold text-gray-900 sm:text-sm">Review Talent Pool</p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">18 new profiles have score &gt; 90. Review and feature.</p>
            <button
              type="button"
              className="mt-4 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-[#8A38F5] hover:text-white sm:px-4 sm:py-2 sm:text-sm"
            >
              View profiles
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow duration-200 hover:shadow-md sm:p-5">
            <p className="text-[11px] font-semibold tracking-wide text-[#8A38F5] uppercase sm:text-xs">Verification</p>
            <p className="mt-2 text-xs font-bold text-gray-900 sm:text-sm">Flagged Employer Alert</p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Company Vantage Tech has 3 unresolved candidate flags.</p>
            <button
              type="button"
              className="mt-4 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-[#8A38F5] hover:text-white sm:px-4 sm:py-2 sm:text-sm"
            >
              Inspect Vantage
            </button>
          </div>
        </div>
      </div>

      {/* Latest updates */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow duration-200 hover:shadow-md sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Latest updates</h2>
        <div className="flex flex-col gap-3">
          {latestUpdates.map((update) => (
            <div
              key={update.id}
              className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-gray-50"
            >
              <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                <span className={`h-2 w-2 shrink-0 rounded-full ${update.dot}`} />
                <p className="truncate text-xs text-gray-700 sm:text-sm">{update.text}</p>
              </div>
              <span className="shrink-0 text-[11px] text-gray-400 sm:text-xs">{update.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}