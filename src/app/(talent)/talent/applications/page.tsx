"use client";

import { manrope, plusJakartaSans } from "@/app/font";
import { useSession } from "@/lib/auth/useSession";
import { applicationsApi } from "@/lib/api/applications";
import type { ApplicationRecord } from "@/lib/types/application";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusStyles: Record<ApplicationRecord["status"], string> = {
  shortlisted: "bg-[#EDE7F8] text-[#8A38F5]",
  interview: "bg-amber-50 text-[#B77A1E]",
  applied: "bg-gray-100 text-gray-700",
  rejected: "bg-red-50 text-[#C94F3D]",
  hired: "bg-green-50 text-green-600",
};

const statusLabels: Record<ApplicationRecord["status"], string> = {
  shortlisted: "Shortlisted",
  interview: "Interview",
  applied: "Applied",
  rejected: "Rejected",
  hired: "bg-green-50 text-green-600",
};

const mockApplications: ApplicationRecord[] = [
  {
    id: "mock-1",
    jobId: "frontend-engineer-kaziflow",
    jobTitle: "Frontend Engineer",
    company: "Kaziflow Technologies",
    location: "Lagos, Nigeria",
    appliedAt: "2026-07-15T10:00:00.000Z",
    status: "shortlisted",
  },
  {
    id: "mock-2",
    jobId: "data-analyst-intern-savanna",
    jobTitle: "Data Analyst Intern",
    company: "Savanna Analytics",
    location: "Nairobi, Kenya",
    appliedAt: "2026-07-17T10:00:00.000Z",
    status: "applied",
  },
  {
    id: "mock-3",
    jobId: "logistics-coordinator-nile",
    jobTitle: "Logistics Coordinator",
    company: "Nile Logistics Co.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-07-10T10:00:00.000Z",
    status: "interview",
  },
  {
    id: "mock-4",
    jobId: "store-supervisor-marketmax",
    jobTitle: "Store Supervisor",
    company: "MarketMax Retail",
    location: "Cairo, Egypt",
    appliedAt: "2026-07-05T10:00:00.000Z",
    status: "rejected",
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: ApplicationRecord["status"] }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap sm:px-3 sm:text-xs ${statusStyles[status]} ${manrope.className}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export default function ApplicationsPage() {
  const { session, loading } = useSession();
  const [realApplications, setRealApplications] = useState<ApplicationRecord[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!session?.email) return;
    setRealApplications(applicationsApi.getAll(session.email));
    setChecked(true);
  }, [session?.email]);

  const isUsingMockData = checked && realApplications.length === 0;
  const applications = isUsingMockData ? mockApplications : realApplications;

  if (loading || !checked) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className={`text-xl font-bold text-black sm:text-2xl ${manrope.className}`}>
            Applications
          </h1>
          <p className={`mt-1 text-xs text-gray-500 sm:text-sm ${plusJakartaSans.className}`}>
            Track the status of every job you&apos;ve applied to.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center sm:p-10">
          <p className={`text-xs text-gray-400 sm:text-sm ${plusJakartaSans.className}`}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className={`text-xl font-bold text-black sm:text-2xl ${manrope.className}`}>
          Applications
        </h1>
        <p className={`mt-1 text-xs text-gray-500 sm:text-sm ${plusJakartaSans.className}`}>
          Track the status of every job you&apos;ve applied to.
        </p>
        <p className={`mt-1 text-xs text-gray-400 sm:text-sm ${plusJakartaSans.className}`}>
          {applications.length} application{applications.length !== 1 ? "s" : ""} submitted
          {isUsingMockData && " (demo data)"}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center sm:p-10">
          <p className={`text-xs text-gray-500 sm:text-sm ${plusJakartaSans.className}`}>
            You haven&apos;t applied to any jobs yet.
          </p>
          <Link
            href="/talent/jobs"
            className="mt-3 inline-block text-xs font-semibold text-[#8A38F5] hover:underline sm:text-sm"
          >
            Browse jobs
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards (below sm breakpoint, <640px) */}
          <div className="flex flex-col gap-3 sm:hidden">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_2px_rgba(16,15,20,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-semibold text-gray-900 ${manrope.className}`}>
                      {app.jobTitle}
                    </p>
                    <p className={`mt-0.5 truncate text-xs text-gray-500 ${plusJakartaSans.className}`}>
                      {app.company} · {app.location}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <p className={`mt-3 text-xs text-gray-400 ${plusJakartaSans.className}`}>
                  Applied {formatDate(app.appliedAt)}
                </p>
              </div>
            ))}
          </div>

          {/* sm and up: table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(16,15,20,0.04),0_16px_32px_-24px_rgba(16,15,20,0.12)] sm:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className={`px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase sm:px-6 sm:py-4 ${manrope.className}`}>
                      Job
                    </th>
                    <th className={`hidden px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase md:table-cell sm:px-6 sm:py-4 ${manrope.className}`}>
                      Company
                    </th>
                    <th className={`hidden px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase lg:table-cell sm:px-6 sm:py-4 ${manrope.className}`}>
                      Location
                    </th>
                    <th className={`px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase sm:px-6 sm:py-4 ${manrope.className}`}>
                      Applied
                    </th>
                    <th className={`px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase sm:px-6 sm:py-4 ${manrope.className}`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className={`px-4 py-4 text-xs font-semibold text-gray-900 sm:px-6 sm:py-5 sm:text-sm ${manrope.className}`}>
                        {app.jobTitle}
                        <p className={`mt-0.5 text-[11px] font-normal text-gray-400 md:hidden ${plusJakartaSans.className}`}>
                          {app.company}
                        </p>
                      </td>
                      <td className={`hidden px-4 py-4 text-sm text-gray-500 md:table-cell sm:px-6 sm:py-5 ${plusJakartaSans.className}`}>
                        {app.company}
                      </td>
                      <td className={`hidden px-4 py-4 text-sm text-gray-500 lg:table-cell sm:px-6 sm:py-5 ${plusJakartaSans.className}`}>
                        {app.location}
                      </td>
                      <td className={`px-4 py-4 text-xs whitespace-nowrap text-gray-500 sm:px-6 sm:py-5 sm:text-sm ${plusJakartaSans.className}`}>
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="px-4 py-4 sm:px-6 sm:py-5">
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}