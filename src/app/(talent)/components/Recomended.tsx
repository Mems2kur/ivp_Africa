"use client";

import { useEffect, useState } from "react";
import { Briefcase, Search } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth/useSession";
import { profileApi } from "@/lib/api/profile";
import { getRecommendedJobs } from "@/lib/utils/recommendations";
import type { Job } from "@/app/(talent)/talent/jobs/job";

export function RecommendedForYou() {
  const { session } = useSession();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!session?.email) return;
    const profile = profileApi.get(session.email);
    setRecommendedJobs(getRecommendedJobs(profile));
  }, [session?.email]);

  return (
    <div className="shadow-[0_4px_12px_rgba(0,0,0,0.08)]  rounded-2xl border border-gray-100 bg-gray-50 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-serif text-xl text-gray-900">Recommended for you</h2>
        <Link
          href="/talent/jobs"
          className="flex items-center gap-1.5 text-sm font-medium text-[#8A38F5] hover:text-[#6425D0]"
        >
          <Search size={16} />
          Search jobs
        </Link>
      </div>

      {recommendedJobs.length === 0 ? (
        <p className="text-sm text-gray-400">No recommendations available right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {recommendedJobs.map((job) => (
            <div key={job.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-[#8A38F5]">
                <Briefcase size={16} />
                {job.type}
              </div>

              <h3 className="mb-1 font-semibold text-gray-900">{job.title}</h3>
              <p className="mb-4 text-sm text-gray-500">
                {job.company} · {job.location}
              </p>

              <Link
                href={`/talent/jobs/${job.id}`}
                className="text-sm font-medium text-[#8A38F5] hover:text-[#6425D0]"
              >
                View & apply →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}