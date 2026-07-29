"use client";

import { ShieldCheck, Briefcase, ClipboardList, ClipboardCheck, TrendingUp } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { MonthlyPerformance } from "../components/MonthlyPerformance";
import { ReportFilterBar } from "../components/ReportFilterBar";

const stats = [
  { icon: ShieldCheck, value: "8,204", label: "Registered candidates" },
  { icon: Briefcase, value: "8,204", label: "Job applications" },
  { icon: ClipboardList, value: "8,204", label: "Active job postings" },
  { icon: ClipboardCheck, value: "8,204", label: "Pending verifications" },
  { icon: TrendingUp, value: "+14.2%", label: "Overall Growth", variant: "white" as const },
];

export default function ReportsPage() {
  function handleFilter(reportType: string, dateRange: string) {
    // TODO: once real data exists, filter the chart/stats by reportType + dateRange
    console.log("Filtering by:", reportType, dateRange);
  }

  function handleExport() {
    // TODO: generate a real CSV/PDF export once real report data exists
    console.log("Exporting data...");
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Reports & Analytics</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Filter platform reports and export for offline review.
        </p>
      </div>

      <ReportFilterBar onFilter={handleFilter} onExport={handleExport} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      <MonthlyPerformance />
    </>
  );
}