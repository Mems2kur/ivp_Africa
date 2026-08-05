"use client";

import { RequireRole } from "@/app/(auth)/requireAuth";
import { EmployerSidebar } from "../employer/components/Sidebar";
import { EmployerTopbar } from "../employer/components/EmployerNavbar";

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="employer">
      <div className="flex bg-gray-50">
        <EmployerSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <EmployerTopbar />
          <main className="flex flex-col min-h-[calc(100vh-4rem)] gap-4 p-3 sm:gap-6 sm:p-6 md:p-7 lg:p-8 !bg-gray-50 ">{children}</main>
        </div>
      </div>
    </RequireRole>
  );
}