"use client";

import { useState } from "react";
import { Building2, Check, X } from "lucide-react";

interface PendingEmployer {
  id: string;
  company: string;
  industry: string;
  submittedDate: string;
  iconBg: string;
  iconColor: string;
}

const iconPalette = [
  { iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { iconBg: "bg-rose-100", iconColor: "text-rose-600" },
  { iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  { iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  { iconBg: "bg-cyan-100", iconColor: "text-cyan-600" },
];

const rawRequests: Omit<PendingEmployer, "iconBg" | "iconColor">[] = [
  { id: "1", company: "Vantage Tech", industry: "Tech & Telco", submittedDate: "Jan 15, 2026" },
  { id: "2", company: "AfriHealth Corp", industry: "Healthcare", submittedDate: "Jan 14, 2026" },
  { id: "3", company: "Safaricom PLC", industry: "Tech & Telco", submittedDate: "Jan 12, 2026" },
  { id: "4", company: "Kaziflow Technologies", industry: "Technology", submittedDate: "Jan 11, 2026" },
  { id: "5", company: "Baobab Microfinance Group", industry: "Finance", submittedDate: "Jan 10, 2026" },
  { id: "6", company: "Sahara Agritech", industry: "Agriculture", submittedDate: "Jan 9, 2026" },
  { id: "7", company: "Nile Logistics Co.", industry: "Logistics", submittedDate: "Jan 8, 2026" },
  { id: "8", company: "Jollof Media House", industry: "Media", submittedDate: "Jan 7, 2026" },
];

// cycle through the palette so colors repeat predictably as the list grows
const initialRequests: PendingEmployer[] = rawRequests.map((req, i) => ({
  ...req,
  ...iconPalette[i % iconPalette.length],
}));

const PAGE_SIZE = 20;

export default function EmployerVerificationPage() {
  const [requests, setRequests] = useState<PendingEmployer[]>(initialRequests);
  const [reviewing, setReviewing] = useState<PendingEmployer | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedRequests = requests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const startIndex = requests.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, requests.length);

  function handleDecision(decision: "approve" | "reject") {
    if (!reviewing) return;
    setRequests((prev) => prev.filter((r) => r.id !== reviewing.id));
    setReviewing(null);
    setPage((p) => Math.min(p, Math.max(1, Math.ceil((requests.length - 1) / PAGE_SIZE))));
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Employer Verification</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Review and approve companies applying to recruit on the platform.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Pending requests</h2>

        {requests.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No pending employer requests right now.
          </p>
        ) : (
         <div className="flex flex-col">
  <div className="overflow-x-auto">
    <table className="w-full min-w-[520px] text-left">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="pb-3 text-xs font-medium text-gray-400">Company</th>
          <th className="hidden pb-3 text-xs font-medium text-gray-400 sm:table-cell">Submitted date</th>
          <th className="pb-3 text-right text-xs font-medium text-gray-400">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {paginatedRequests.map((req) => (
          <tr key={req.id} className="transition-colors hover:bg-gray-50">
            <td className="py-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${req.iconBg}`}>
                  <Building2 size={18} className={req.iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{req.company}</p>
                  <p className="text-xs text-gray-400">{req.industry}</p>
                  <p className="mt-0.5 text-xs text-gray-400 sm:hidden">{req.submittedDate}</p>
                </div>
              </div>
            </td>
            <td className="hidden py-4 text-sm text-gray-500 sm:table-cell">{req.submittedDate}</td>
            <td className="py-4 text-right">
              <div className="flex items-center justify-end gap-4">
                <button type="button" className="text-sm font-semibold text-[#8A38F5] hover:underline">
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => setReviewing(req)}
                  className="rounded-xl bg-[#8A38F5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0]"
                >
                  Review Request
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-xs text-gray-400 sm:text-sm">
      Showing {startIndex}-{endIndex} of {requests.length} requests
    </p>
    {totalPages > 1 && (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:border-gray-200 disabled:hover:bg-transparent"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:border-gray-200 disabled:hover:bg-transparent"
        >
          Next
        </button>
      </div>
    )}
  </div>
</div>
        )}
      </div>

      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${reviewing.iconBg}`}>
                <Building2 size={20} className={reviewing.iconColor} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{reviewing.company}</h3>
                <p className="text-xs text-gray-400">{reviewing.industry}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Submitted on {reviewing.submittedDate}. Approve this employer to let them post jobs
              and access candidate profiles, or reject if their information doesn&apos;t check out.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => handleDecision("reject")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <X size={16} />
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleDecision("approve")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#8A38F5] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0]"
              >
                <Check size={16} />
                Approve
              </button>
            </div>

            <button
              type="button"
              onClick={() => setReviewing(null)}
              className="mt-3 w-full text-center text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}