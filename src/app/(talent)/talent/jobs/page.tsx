"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { jobs, type Job } from "@/app//(talent)/talent/jobs/job";

const jobTypes: Job["type"][] = ["Full-time", "Internship", "Part-time", "Contract"];

// Mirrors the categories from Internship Preferences
const categories = [
  "Technology",
  "Data & AI",
  "Finance",
  "Agriculture",
  "Logistics",
  "Healthcare",
  "Media",
  "Energy",
  "Hospitality",
  "Retail",
  "Human Resources",
];

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
      <span
        onClick={onChange}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
          checked ? "bg-[#8A38F5]" : "border border-gray-300 bg-white"
        }`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggle = (
    value: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesQuery =
        query.trim() === "" ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category);
      return matchesQuery && matchesType && matchesCategory;
    });
  }, [query, selectedTypes, selectedCategories]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-black">Jobs</h1>

      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs, companies..."
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Filters sidebar */}
        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900">Job type</h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {jobTypes.map((type) => (
              <FilterCheckbox
                key={type}
                label={type}
                checked={selectedTypes.includes(type)}
                onChange={() => toggle(type, selectedTypes, setSelectedTypes)}
              />
            ))}
          </div>

          <h2 className="mt-6 text-sm font-bold text-gray-900">Category</h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {categories.map((cat) => (
              <FilterCheckbox
                key={cat}
                label={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => toggle(cat, selectedCategories, setSelectedCategories)}
              />
            ))}
          </div>
        </div>

        {/* Job list */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400">{filteredJobs.length} jobs found</p>

          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              href={`/talent/jobs/${job.id}`}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-base font-semibold text-white">
                  {job.initial}
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{job.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {job.company} · {job.location}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {job.salary} · {job.postedDaysAgo} days ago · {job.level}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[#EDE7F8] px-3 py-1 text-xs font-medium text-[#8A38F5]">
                {job.type}
              </span>
            </Link>
          ))}

          {filteredJobs.length === 0 && (
            <p className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400">
              No jobs match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}