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

export function RecentActivity({ applications }: { applications: Application[] }) {
  return (
    <div className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-2xl border border-gray-100 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-serif text-xl text-gray-900">Recent applications</h2>
        <Link
          href="/talent/applications"
          className="text-sm font-medium text-[#8A38F5] hover:text-[#6425D0]"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {applications.map((app) => (
          <div key={app.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-semibold text-gray-900">{app.jobTitle}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                {app.company} · {app.location}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[app.status]}`}
            >
              {statusLabels[app.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}