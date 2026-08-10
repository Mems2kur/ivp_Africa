"use client";

import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Download, MoreVertical } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { employerCandidatesApi ,EmployerCandidate, PipelineStage } from "@/lib/api/candidate";

const funnelStages: { stage: PipelineStage; color: string }[] = [
  { stage: "New", color: "#8A38F5" },
  { stage: "Screening", color: "#3B82F6" },
  { stage: "Interview", color: "#22C55E" },
  { stage: "Offered", color: "#F59E0B" },
  { stage: "Hired", color: "#EF4444" },
];

// Mock month-over-month trend — no real historical data exists to derive this from yet
const monthlyTrend = [
  { month: "Feb", applications: 40 },
  { month: "Mar", applications: 65 },
  { month: "Apr", applications: 90 },
  { month: "May", applications: 150 },
  { month: "Jun", applications: 175 },
  { month: "Jul", applications: 160 },
];

const departmentBreakdown = [
  { department: "Product & Design", applicants: 412, hires: 14 },
  { department: "Engineering", applicants: 580, hires: 22 },
  { department: "Sales & Admin", applicants: 292, hires: 8 },
];

function toCsv(candidates: EmployerCandidate[]): string {
  const header = "Name,Role,Stage,Applied On\n";
  const body = candidates
    .map((c) => `"${c.name}","${c.role}","${c.stage}","${new Date(c.appliedAt).toISOString().slice(0, 10)}"`)
    .join("\n");
  return header + body;
}

export default function ReportsPage() {
  const { session } = useSession();
  const [candidates, setCandidates] = useState<EmployerCandidate[]>([]);
  const [range, setRange] = useState<"Weekly" | "Monthly">("Monthly");

  useEffect(() => {
    if (!session?.email) return;
    setCandidates(employerCandidatesApi.getAll(session.email));
  }, [session?.email]);

  const totalApplications = candidates.length;

  const funnelCounts = useMemo(() => {
    return funnelStages.map(({ stage, color }) => ({
      stage,
      color,
      count: candidates.filter((c) => c.stage === stage).length,
    }));
  }, [candidates]);

  const funnelMax = Math.max(...funnelCounts.map((f) => f.count), 1);
  const offerAcceptanceRate =
    funnelCounts.find((f) => f.stage === "Offered")!.count > 0
      ? Math.round(
          (funnelCounts.find((f) => f.stage === "Hired")!.count /
            funnelCounts.find((f) => f.stage === "Offered")!.count) *
            100
        )
      : 0;

  function handleExportCsv() {
    const csv = toCsv(candidates);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `talent-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">Talent Performance Report</h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Hiring efficiency metrics, demographic conversions, and cost optimization tables.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl bg-[#8A38F5] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#7226e0] sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <Download size={15} className="sm:size-4" />
          Export CSV/PDF
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-3 transition-shadow hover:shadow-md sm:p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-500 sm:text-xs md:text-sm">Total Applications</p>
            <span className="h-2 w-2 rounded-full bg-[#8A38F5]" />
          </div>
          <p className="mt-1.5 text-lg font-bold text-gray-900 sm:mt-2 sm:text-xl md:text-2xl">{totalApplications}</p>
          <p className="mt-1 text-[10px] font-medium text-green-600 sm:text-[11px] md:text-xs">↑ 12% vs last month</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-3 transition-shadow hover:shadow-md sm:p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-500 sm:text-xs md:text-sm">Time to Hire</p>
            <span className="h-2 w-2 rounded-full bg-green-500" />
          </div>
          <p className="mt-1.5 text-lg font-bold text-gray-900 sm:mt-2 sm:text-xl md:text-2xl">18 Days</p>
          <p className="mt-1 text-[10px] font-medium text-green-600 sm:text-[11px] md:text-xs">↓ 4 days vs avg</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-3 transition-shadow hover:shadow-md sm:p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-500 sm:text-xs md:text-sm">Offer Acceptance</p>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <p className="mt-1.5 text-lg font-bold text-gray-900 sm:mt-2 sm:text-xl md:text-2xl">{offerAcceptanceRate}%</p>
          <p className="mt-1 text-[10px] font-medium text-green-600 sm:text-[11px] md:text-xs">↑ 2% vs last quarter</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-3 transition-shadow hover:shadow-md sm:p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-500 sm:text-xs md:text-sm">Cost per Hire</p>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <p className="mt-1.5 text-lg font-bold text-gray-900 sm:mt-2 sm:text-xl md:text-2xl">$1,450</p>
          <p className="mt-1 text-[10px] font-medium text-green-600 sm:text-[11px] md:text-xs">↓ 8% optimized</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Applications over time */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md sm:p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 sm:text-base">Applications Over Time</h2>
            <div className="flex rounded-lg bg-gray-100 p-0.5">
              {(["Weekly", "Monthly"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                    range === option ? "bg-white text-[#8A38F5] shadow-sm" : "text-gray-500"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE7F8", fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#8A38F5"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#8A38F5" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application funnel */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md sm:p-6">
          <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Application Funnel</h2>
          <div className="flex flex-col gap-3">
            {funnelCounts.map(({ stage, color, count }) => {
              const widthPercent = totalApplications > 0 ? Math.max((count / funnelMax) * 100, count > 0 ? 8 : 0) : 0;
              const percentOfTotal = totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-xs text-gray-500 sm:text-sm">{stage}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${widthPercent}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-semibold text-gray-900">{count}</span>
                  <span className="w-9 shrink-0 text-right text-[10px] text-gray-400">{percentOfTotal}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance by department */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Performance metrics by Business Department</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-[10px] font-medium text-gray-400 uppercase sm:text-xs">Department</th>
                <th className="pb-3 text-right text-[10px] font-medium text-gray-400 uppercase sm:text-xs">Applicants</th>
                <th className="pb-3 text-right text-[10px] font-medium text-gray-400 uppercase sm:text-xs">Hires</th>
                <th className="pb-3 text-right text-[10px] font-medium text-gray-400 uppercase sm:text-xs">Process Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departmentBreakdown.map((dept) => (
                <tr key={dept.department}>
                  <td className="py-3 text-sm font-semibold text-gray-900">{dept.department}</td>
                  <td className="py-3 text-right text-sm text-gray-700">{dept.applicants}</td>
                  <td className="py-3 text-right text-sm text-gray-700">{dept.hires}</td>
                  <td className="py-3 text-right">
                    <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="More options">
                      <MoreVertical size={16} className="ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}