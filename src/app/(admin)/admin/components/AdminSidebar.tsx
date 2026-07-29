"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Users,
  ShieldCheck,
  Briefcase,
  CreditCard,
  BarChart3,
  FileText,
  ScrollText,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { session as sessionStore } from "@/lib/auth/session";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "User management", href: "/admin/users", icon: Users },
  { label: "Employer verification", href: "/admin/employer-verification", icon: ShieldCheck },
  { label: "Job management", href: "/admin/jobs", icon: Briefcase },
  { label: "Subscription management", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Reports & analytics", href: "/admin/reports", icon: BarChart3 },
  { label: "Content management", href: "/admin/content", icon: FileText },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Audit logs", href: "/admin/audit-logs", icon: ScrollText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    sessionStore.clear();
    router.push("/login");
  }

  return (
   <aside className="sticky top-0 flex w-16 shrink-0 flex-col justify-between overflow-y-auto border-r border-gray-100 bg-white px-2 py-6 lg:w-64 lg:px-4">
      <div>
        <div className="mb-8 flex items-center justify-center gap-2 px-0 lg:justify-start lg:px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8A38F5] text-sm font-bold text-white">
            IV
          </div>
          <span className="hidden text-sm font-bold tracking-wide text-gray-900 lg:inline">
            IVP AFRICA
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center justify-center gap-3 rounded-xl px-0 py-2.5 text-sm font-medium transition-colors lg:justify-start lg:px-3 ${
                  isActive
                    ? "bg-[#EDE7F8] text-[#8A38F5]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        title="Log out"
        className="flex items-center justify-center gap-3 rounded-xl px-0 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 lg:justify-start lg:px-3"
      >
        <LogOut size={18} className="shrink-0" />
        <span className="hidden lg:inline">Log out</span>
      </button>
    </aside>
  );
}