"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { searchAdmin } from "@/lib/utils/adminSearch";

function getInitials(name: string) {
  if (!name?.trim()) return "?";
  return name.trim().split(/\s+/).map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");
}

export function AdminTopbar() {
  const { session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchAdmin(query), [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(href: string) {
    setDropdownOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <header className="flex items-center justify-between gap-2 border-b border-gray-100 bg-white px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 lg:gap-6 lg:px-8">
      <div ref={searchRef} className="relative min-w-0 flex-1 lg:max-w-md">
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 sm:px-4 sm:py-2.5">
          <Search size={16} className="shrink-0 text-gray-400 sm:size-[18px]" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => query.trim() && setDropdownOpen(true)}
            placeholder="Search admin tools, profiles..."
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {dropdownOpen && query.trim() && (
          <div className="absolute top-full left-0 z-20 mt-2 w-full rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">No matches for &quot;{query}&quot;</p>
            ) : (
              results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelect(result.href)}
                  className="flex w-full flex-col items-start px-4 py-2 text-left hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">{result.label}</span>
                  <span className="text-xs text-gray-400">{result.subtitle}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
         <button
          type="button"
          aria-label="Notifications"
          onClick={() => router.push("/admin/notifications")}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-[#EDE7F8] hover:text-[#3A2680] sm:h-10 sm:w-10"
        >
          <Bell size={16} className="shrink-0 sm:size-[18px]" />
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/profile")}
          className="hidden items-center gap-2.5 sm:flex"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#8A38F5] text-xs font-semibold text-white sm:h-9 sm:w-9 sm:text-sm">
            {session?.avatarUrl ? (
              <img src={session.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              getInitials(session?.displayName ?? "Admin")
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{session?.displayName ?? "Admin"}</p>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}