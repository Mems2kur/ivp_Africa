import Link from "next/link";
import type { ApplicationRecord } from "@/lib/types/application";

const statusStyles: Record<ApplicationRecord["status"], string> = {
  shortlisted: "bg-[#EDE7F8] text-[#8A38F5]",
  interview: "bg-amber-50 text-[#B77A1E]",
  applied: "bg-gray-100 text-gray-500",
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

export function RecentActivity({ applications }: { applications: ApplicationRecord[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow duration-200 hover:shadow-md sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 sm:text-base">Recent applications</h2>
        <Link
          href="/talent/applications"
          className="text-xs font-medium text-[#8A38F5] transition-colors hover:text-[#6C3CFF] hover:underline sm:text-sm"
        >
          View all
        </Link>
      </div>

      {applications.length === 0 ? (
        <p className="py-6 text-center text-xs text-gray-400 sm:text-sm">
          No applications yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 transition-colors duration-150 hover:bg-[#EDE7F8] sm:px-4 sm:py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">{app.jobTitle}</p>
                <p className="mt-0.5 truncate text-[11px] text-gray-500 sm:text-xs">
                  {app.company} · {app.location}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap sm:px-3 sm:text-xs ${statusStyles[app.status]}`}
              >
                {statusLabels[app.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}