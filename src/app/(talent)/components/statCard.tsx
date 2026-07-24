import Link from "next/link";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  status: "shortlisted" | "interview" | "applied" | "rejected";
}

const statusStyles: Record<Application["status"], string> = {
  shortlisted: "bg-[#EDE7F8] text-[#8A38F5]",
  interview: "bg-amber-50 text-[#B77A1E]",
  applied: "bg-gray-100 text-gray-500",
  rejected: "bg-red-50 text-[#C94F3D]",
};

const statusLabels: Record<Application["status"], string> = {
  shortlisted: "Shortlisted",
  interview: "Interview",
  applied: "Applied",
  rejected: "Rejected",
};

export function RecentActivity({
  applications,
}: {
  applications: Application[];
}) {
  return (
<div className=" mt-20 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_20px_50px_rgba(138,56,245,0.25)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(138,56,245,0.35)] sm:p-5">      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#3A2680] sm:text-lg">
          Recent applications
        </h2>

        <Link
          href="/talent/applications"
          className="text-xs font-medium text-[#8A38F5] hover:underline sm:text-sm"
        >
          View all
        </Link>
      </div>

      <div className="mt-2 divide-y divide-gray-100">
        {applications.map((app) => (
          <div
            key={app.id}
            className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#3A2680]">
                {app.jobTitle}
              </p>

              <p className="mt-0.5 truncate text-xs text-gray-500">
                {app.company} · {app.location}
              </p>
            </div>

            <span
              className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[app.status]}`}
            >
              {statusLabels[app.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}