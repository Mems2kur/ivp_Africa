"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, X } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { savedJobsApi } from "@/lib/api/applications";
import type { SavedJobRecord } from "@/lib/types/application";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SavedJobsPage() {
  const { session } = useSession();
  const [savedJobs, setSavedJobs] = useState<SavedJobRecord[]>([]);

  function refresh() {
    if (!session?.email) return;
    setSavedJobs(savedJobsApi.getAll(session.email));
  }

  useEffect(() => {
    refresh();
  }, [session?.email]);

  function handleRemove(jobId: string, jobTitle: string, company: string, location: string) {
    if (!session?.email) return;
    savedJobsApi.toggle(session.email, { id: jobId, title: jobTitle, company, location });
    refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-black sm:text-2xl">Saved Jobs</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Jobs you&apos;ve bookmarked to revisit later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center sm:p-10">
          <Bookmark size={28} className="mx-auto text-gray-300" />
          <p className="mt-3 text-xs text-gray-500 sm:text-sm">You haven&apos;t saved any jobs yet.</p>
          <Link
            href="/talent/jobs"
            className="mt-3 inline-block text-xs font-semibold text-[#8A38F5] hover:underline sm:text-sm"
          >
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {savedJobs.map((job) => (
            <div
              key={job.jobId}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-3 transition-shadow hover:shadow-sm sm:rounded-2xl sm:p-5"
            >
              <Link href={`/talent/jobs/${job.jobId}`} className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 sm:text-base">{job.jobTitle}</p>
                <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
                  {job.company} · {job.location}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400 sm:text-xs">
                  Saved {formatDate(job.savedAt)}
                </p>
              </Link>

              <button
                type="button"
                onClick={() => handleRemove(job.jobId, job.jobTitle, job.company, job.location)}
                aria-label="Remove from saved jobs"
                className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}