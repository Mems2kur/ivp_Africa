"use client";

import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";

interface ReportFilterBarProps {
  onFilter: (reportType: string, dateRange: string) => void;
  onExport: () => void;
}

export function ReportFilterBar({ onFilter, onExport }: ReportFilterBarProps) {
  const [reportType, setReportType] = useState("Candidate registrations");
  const [dateRange, setDateRange] = useState("");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative">
          <label className="mb-1 block text-xs text-gray-400">Report type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pr-9 pl-3 text-sm font-medium text-gray-900 outline-none sm:w-56"
          >
            <option>Candidate registrations</option>
            <option>Job applications</option>
            <option>Employer verifications</option>
            <option>Subscription revenue</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 bottom-3 text-gray-400" />
        </div>

        <div className="relative">
          <label className="mb-1 block text-xs text-gray-400">Date range</label>
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="MM/DD/YYYY"
            className="w-full rounded-xl border border-gray-200 py-2.5 pr-9 pl-3 text-sm font-medium text-gray-900 outline-none sm:w-40"
          />
          <ChevronDown size={16} className="pointer-events-none absolute right-3 bottom-3 text-gray-400" />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onFilter(reportType, dateRange)}
          className="flex-1 rounded-xl bg-[#8A38F5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0] sm:flex-none"
        >
          Filter
        </button>
        <button
          type="button"
          onClick={onExport}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#8A38F5] px-5 py-2.5 text-sm font-semibold text-[#8A38F5] transition-colors hover:bg-[#EDE7F8] sm:flex-none"
        >
          <Download size={16} />
          Export Data
        </button>
      </div>
    </div>
  );
}