"use client";

import { useState } from "react";

interface JobRecord {
  id: string;
  title: string;
  company: string;
  status: "Active" | "Filled" | "Flagged";
  applicants: number;
}

const mockJobs: JobRecord[] = [
  { id: "1", title: "Senior React Developer", company: "Vantage Tech", status: "Active", applicants: 48 },
  { id: "2", title: "Technical Recruiter", company: "AfriHealth Corp", status: "Filled", applicants: 12 },
  { id: "3", title: "Customer Success Lead", company: "Safaricom PLC", status: "Flagged", applicants: 3 },
  { id: "4", title: "Frontend Engineer", company: "Kaziflow Technologies", status: "Active", applicants: 31 },
  { id: "5", title: "Loan Officer", company: "Baobab Microfinance Group", status: "Active", applicants: 9 },
  { id: "6", title: "Field Agronomist", company: "Sahara Agritech", status: "Filled", applicants: 6 },
  { id: "7", title: "Logistics Coordinator", company: "Nile Logistics Co.", status: "Active", applicants: 17 },
  { id: "8", title: "Social Media Manager", company: "Jollof Media House", status: "Flagged", applicants: 2 },
];

const statusStyles: Record<JobRecord["status"], string> = {
  Active: "bg-green-50 text-green-700",
  Filled: "bg-gray-100 text-gray-500",
  Flagged: "bg-amber-50 text-amber-700",
};

const PAGE_SIZE = 20; // raised so mock data fits on one page; pagination only shows once real data exceeds this

export default function JobManagementPage() {
  const [jobs] = useState<JobRecord[]>(mockJobs);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedJobs = jobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const startIndex = jobs.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, jobs.length);

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Job Management</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Monitor active job listings, applications, and flag reported postings.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-xs font-medium text-gray-400 sm:px-6">Job Title</th>
                <th className="hidden px-4 py-3 text-xs font-medium text-gray-400 sm:table-cell sm:px-6">Company</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 sm:px-6">Status</th>
                <th className="hidden px-4 py-3 text-xs font-medium text-gray-400 md:table-cell sm:px-6">Applications</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 sm:px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedJobs.map((job) => (
                <tr key={job.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-4 sm:px-6">
                    <p className="text-sm font-semibold text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-400 sm:hidden">{job.company}</p>
                  </td>
                  <td className="hidden px-4 py-4 text-sm text-gray-600 sm:table-cell sm:px-6">{job.company}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${statusStyles[job.status]}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 text-sm text-gray-500 md:table-cell sm:px-6">
                    {job.applicants} applicants
                  </td>
                  <td className="px-4 py-4 text-right sm:px-6">
                    <button
                      type="button"
                      className="rounded-lg border border-[#8A38F5] px-4 py-1.5 text-xs font-semibold text-[#8A38F5] transition-colors hover:bg-[#8A38F5] hover:text-white"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedJobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                    No job postings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-gray-400 sm:text-sm">
              {/* {jobs.length === 0
                ? "No jobs found"
                : `Showing ${startIndex}-${endIndex} of ${jobs.length} jobs`} */}
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
    </>
  );
}