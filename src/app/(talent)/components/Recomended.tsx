import { Briefcase } from "lucide-react";
import Link from "next/link";
import {  Search } from "lucide-react";
interface RecommendedJob {
  id: string;
  type: "Full-time" | "Contract" | "Internship" | "Part-time";
  title: string;
  company: string;
  location: string;
}

const recommendedJobs: RecommendedJob[] = [
  {
    id: "1",
    type: "Full-time",
    title: "Junior Product Manager",
    company: "Chipper Cash",
    location: "Kigali, RW",
  },
  {
    id: "2",
    type: "Contract",
    title: "Graphic Designer",
    company: "Jumia",
    location: "Cairo, EG",
  },
  {
    id: "3",
    type: "Internship",
    title: "Software Engineer Intern",
    company: "M-KOPA",
    location: "Nairobi, KE",
  },
];

export function RecommendedForYou() {
  return (
    <div className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] mt-6 rounded-2xl  border border-gray-100 bg-gray-50 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-serif text-xl text-gray-900">
          Recommended for you
        </h2>
        <Link
          href="/jobs"
          className="flex items-center gap-1.5 text-sm font-medium text-[#8A38F5] hover:text-[#6425D0]"
        >
          <Search size={16} />
          Search jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recommendedJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-[#8A38F5]">
              <Briefcase size={16} />
              {job.type}
            </div>

            <h3 className="mb-1 font-semibold text-gray-900">{job.title}</h3>
            <p className="mb-4 text-sm text-gray-500">
              {job.company} · {job.location}
            </p>

            <Link
              href={`/jobs/${job.id}`}
              className="text-sm font-medium text-[#8A38F5] hover:text-[#6425D0]"
            >
              View & apply →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}