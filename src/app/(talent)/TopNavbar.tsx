"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { session as sessionStore } from "@/lib/auth/session";
import { notificationsApi } from "@/lib/api/notification";
interface TopNavbarProps {
  section: string;
  title: string;
  userName: string;
}

function getInitials(name: string) {
  if (!name?.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export function TopNavbar({ section, title, userName }: TopNavbarProps) {
  const [query, setQuery] = useState("");
  const { session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  function handleLogout() {
    sessionStore.clear();
    router.push("/login");
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(query.trim())}`);
    }
  }
useEffect(() => {
  if (!session?.email) return;
  const update = () => setUnreadCount(notificationsApi.unreadCount(session.email));
  update();
  const unsubscribe = notificationsApi.subscribe(update);
  return unsubscribe;
}, [session?.email]);

  return (
    <header className="flex items-center justify-between gap-6 border-b border-gray-100 bg-white px-8 py-4">
      <div className="shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#8A38F5]">
          {section}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex w-full max-w-md items-center gap-2 rounded-xl bg-[#F5F3FA] px-4 py-2.5">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search jobs, applications..."
          className="w-full bg-transparent text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      <div className="flex shrink-0 items-center gap-3">
       <button
  type="button"
  aria-label="Notifications"
  onClick={() => router.push("/talent/notifications")}
  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-[#EDE7F8] hover:text-[#3A2680]"
>
  <Bell size={18} />
  {unreadCount > 0 && (
    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#8A38F5] ring-2 ring-white" />
  )}
</button>

       <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#8A38F5] text-sm font-semibold text-white"
          >
            {session?.avatarUrl ? (
              <img src={session.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              getInitials(session?.displayName ?? "there")
            )}
          </button>
      </div>
    </header>
  );
}