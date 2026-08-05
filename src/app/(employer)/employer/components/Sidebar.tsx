"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Briefcase,
  Users,
  Building2,
  CalendarDays,
  MessageSquare,
  Bell,
  CreditCard,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { session as sessionStore } from "@/lib/auth/session";
import { useSession } from "@/lib/auth/useSession";

const navItems = [
  { label: "Dashboard", href: "/employer", icon: LayoutGrid },
  { label: "Job Postings", href: "/employer/jobs", icon: Briefcase },
  { label: "Candidates", href: "/employer/candidates", icon: Users },
  { label: "Company Profile", href: "/employer/company-profile", icon: Building2 },
  { label: "Interviews", href: "/employer/interviews", icon: CalendarDays },
  { label: "Messages", href: "/employer/messages", icon: MessageSquare },
  { label: "Notifications", href: "/employer/notifications", icon: Bell },
  { label: "Subscription", href: "/employer/subscription", icon: CreditCard },
  { label: "Settings", href: "/employer/settings", icon: Settings },
  { label: "Reports", href: "/employer/reports", icon: BarChart3 },
];

function getInitials(name: string) {
  if (!name?.trim()) return "?";
  return name.trim().split(/\s+/).map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");
}

export function EmployerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useSession();

  function isActive(href: string) {
    if (href === "/employer") return pathname === "/employer";
    return pathname.startsWith(href);
  }

  function handleLogout() {
    sessionStore.clear();
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 flex w-14 shrink-0 flex-col justify-between overflow-y-auto border-r border-gray-100 bg-white px-1.5 py-5 sm:w-16 sm:px-2 sm:py-6 lg:w-64 lg:px-4">
      <div>
        <div className="mb-5 flex items-center justify-center gap-2 px-0 sm:mb-6 lg:justify-start lg:px-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#8A38F5] text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm">
            IV
          </div>
          <span className="hidden text-sm font-bold tracking-wide text-gray-900 lg:inline">
            IVP AFRICA
          </span>
        </div>

        <p className="mb-2 hidden px-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase lg:block">
          Main Menu
        </p>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center justify-center gap-3 rounded-xl px-0 py-2 text-sm font-medium transition-colors sm:py-2.5 lg:justify-start lg:px-3 ${
                  active
                    ? "bg-[#EDE7F8] text-[#8A38F5]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={16} className="shrink-0 sm:size-[18px]" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="hidden items-center gap-2.5 border-t border-gray-100 px-2 pt-4 lg:flex">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-xs font-semibold text-white">
            {getInitials(session?.displayName ?? "Company")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {session?.displayName ?? "Company"}
            </p>
            <p className="text-xs text-gray-400">Enterprise Portal</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          className="mt-2 flex items-center justify-center gap-3 rounded-xl px-0 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 sm:py-2.5 lg:justify-start lg:px-3"
        >
          <LogOut size={16} className="shrink-0 sm:size-[18px]" />
          <span className="hidden lg:inline">Log out</span>
        </button>
      </div>
    </aside>
  );
}