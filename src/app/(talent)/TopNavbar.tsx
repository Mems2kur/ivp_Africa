"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";

interface TopNavbarProps {
  section: string;
  title: string;
  userName: string;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export function TopNavbar({ section, title, userName }: TopNavbarProps) {
  const [query, setQuery] = useState("");

  return (
    <header className="flex items-center justify-between gap-6 border-b border-gray-100 bg-white px-8 py-4">
      {/* Section label + page title - left */}
      <div className="shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#8A38F5]">
          {section}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Search bar - center */}
      <div className="flex w-full max-w-md items-center gap-2 rounded-xl bg-[#F5F3FA] px-4 py-2.5">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs, applications..."
          className="w-full bg-transparent text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      {/* Bell + user - right */}
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-[#EDE7F8] hover:text-[#3A2680]"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#8A38F5] ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8A38F5] text-sm font-semibold text-white">
            {getInitials(userName)}
          </div>
          <p className="text-sm font-semibold text-gray-900">{userName}</p>
        </div>
      </div>
    </header>
  );
}