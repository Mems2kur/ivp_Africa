"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useSession } from "@/lib/auth/useSession";

const stats = [
  { label: "Active Jobs", value: "12", delta: "+2 this week", dot: "bg-[#8A38F5]" },
  { label: "Applicants", value: "156", delta: "+18 this week", dot: "bg-blue-500" },
  { label: "Interviews", value: "24", delta: "+4 this week", dot: "bg-amber-500" },
  { label: "Hires", value: "8", delta: "+6 this month", dot: "bg-green-500" },
];

interface Applicant {
  id: string;
  name: string;
  role: string;
  status: "Hired" | "Screening" | "Interview" | "Assessment";
  timeAgo: string;
}

const recentApplicants: Applicant[] = [
  { id: "1", name: "Chinedu Okafor", role: "Product Designer", status: "Hired", timeAgo: "2 hrs ago" },
  { id: "2", name: "Genevive Mensah", role: "Backend Developer", status: "Screening", timeAgo: "5 hrs ago" },
  { id: "3", name: "Gideon Pryce", role: "UI Designer", status: "Interview", timeAgo: "1d ago" },
  { id: "4", name: "Thando Ngobela", role: "Data Analyst", status: "Assessment", timeAgo: "2d ago" },
];

const statusStyles: Record<Applicant["status"], string> = {
  Hired: "bg-green-50 text-green-700",
  Screening: "bg-[#EDE7F8] text-[#8A38F5]",
  Interview: "bg-blue-50 text-blue-700",
  Assessment: "bg-amber-50 text-amber-700",
};

const funnelData = [
  { name: "Applications", value: 85, color: "#8A38F5" },
  { name: "Interviews", value: 42, color: "#3B82F6" },
  { name: "Hired", value: 18, color: "#22C55E" },
];
const funnelTotal = funnelData.reduce((sum, d) => sum + d.value, 0);

interface TopJob {
  id: string;
  title: string;
  location: string;
  workMode: string;
  applicants: number;
  interviews: number;
  hires: number;
}

const topJobs: TopJob[] = [
  { id: "1", title: "Product Designer", location: "Lagos", workMode: "Remote", applicants: 45, interviews: 24, hires: 10 },
  { id: "2", title: "Front-End Developer", location: "Accra", workMode: "Full-time", applicants: 34, interviews: 9, hires: 0 },
  { id: "3", title: "Personal Assistant", location: "Cairo", workMode: "Full-time", applicants: 109, interviews: 11, hires: 6 },
];

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");
}

export default function EmployerDashboardPage() {
  const { session } = useSession();
  const firstName = session?.displayName?.split(" ")[0] ?? "there";

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
            Good morning, {firstName} 👋
          </h1>
          <p className="mt-1 text-[11px] text-gray-500 sm:text-xs md:text-sm">
            Here&apos;s what&apos;s happening with your recruitment platform today.
          </p>
        </div>
        <Link
          href="/employer/jobs/new"
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#8A38F5] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#7226e0] sm:self-start sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <Plus size={15} className="sm:size-4" />
          Post a Job
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative rounded-2xl border border-gray-100 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4 md:p-5"
          >
            <span className={`absolute top-3 right-3 h-2 w-2 rounded-full sm:top-4 sm:right-4 ${stat.dot}`} />
            <p className="text-[11px] text-gray-500 sm:text-xs md:text-sm">{stat.label}</p>
            <p className="mt-1.5 text-lg font-bold text-gray-900 sm:mt-2 sm:text-xl md:text-2xl">
              {stat.value}
            </p>
            <p className="mt-1 text-[10px] font-medium text-green-600 sm:text-[11px] md:text-xs">
              {stat.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Recent Applicants */}
        <div className="rounded-2xl border border-gray-100 bg-white p-3 transition-shadow duration-200 hover:shadow-md sm:p-5 md:p-6 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">Recent Applicants</h2>
            <Link
              href="/employer/candidates"
              className="text-[11px] font-medium text-[#8A38F5] transition-colors hover:text-[#6C3CFF] hover:underline sm:text-xs md:text-sm"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {recentApplicants.map((applicant) => (
              <div key={applicant.id} className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0 sm:gap-3 sm:py-3">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white sm:h-9 sm:w-9 sm:text-xs">
                    {getInitials(applicant.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">{applicant.name}</p>
                    <p className="truncate text-[10px] text-gray-500 sm:text-xs">{applicant.role}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap sm:px-3 sm:py-1 sm:text-xs ${statusStyles[applicant.status]}`}>
                    {applicant.status}
                  </span>
                  <span className="hidden text-xs text-gray-400 md:inline">{applicant.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Funnel */}
        <div className="rounded-2xl border border-gray-100 bg-white p-3 transition-shadow duration-200 hover:shadow-md sm:p-5 md:p-6">
          <h2 className="mb-3 text-xs font-bold text-gray-900 sm:mb-4 sm:text-sm md:text-base">
            Application Funnel
          </h2>

          <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={funnelData}
                  dataKey="value"
                  innerRadius="65%"
                  outerRadius="100%"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {funnelData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">{funnelTotal}</p>
              <p className="text-[10px] text-gray-400 sm:text-[11px] md:text-xs">Total</p>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-1.5 sm:mt-4 sm:gap-2">
            {funnelData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-[11px] sm:text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-gray-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Jobs */}
      <div className="rounded-2xl border border-gray-100 bg-white p-3 transition-shadow duration-200 hover:shadow-md sm:p-5 md:p-6">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h2 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">Top Performing Jobs</h2>
          <Link
            href="/employer/jobs"
            className="text-[11px] font-medium text-[#8A38F5] transition-colors hover:text-[#6C3CFF] hover:underline sm:text-xs md:text-sm"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-[10px] font-medium text-gray-400 sm:pb-3 sm:text-xs">Job role</th>
                <th className="pb-2 text-right text-[10px] font-medium text-gray-400 sm:pb-3 sm:text-xs">Applicants</th>
                <th className="pb-2 text-right text-[10px] font-medium text-gray-400 sm:pb-3 sm:text-xs">Interviews</th>
                <th className="pb-2 text-right text-[10px] font-medium text-gray-400 sm:pb-3 sm:text-xs">Hires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topJobs.map((job) => (
                <tr key={job.id}>
                  <td className="py-2.5 sm:py-3">
                    <p className="text-xs font-semibold text-gray-900 sm:text-sm">{job.title}</p>
                    <p className="text-[10px] text-gray-400 sm:text-xs">
                      {job.location} · {job.workMode}
                    </p>
                  </td>
                  <td className="py-2.5 text-right text-xs text-gray-700 sm:py-3 sm:text-sm">{job.applicants}</td>
                  <td className="py-2.5 text-right text-xs text-gray-700 sm:py-3 sm:text-sm">{job.interviews}</td>
                  <td className="py-2.5 text-right text-xs text-gray-700 sm:py-3 sm:text-sm">{job.hires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}