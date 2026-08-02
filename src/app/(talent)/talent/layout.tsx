"use client";

import { Sidebar } from "../sidebar/sideBar";
import { TopNavbar } from "../TopNavbar";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { useSession } from "@/lib/auth/useSession";

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();

  return (
    <div className="flex bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <TopNavbar
          section="Talent"
          title="Dashboard"
          userName={session?.displayName ?? "there"}
        />

        <main className={`flex flex-col gap-6 p-4 sm:p-6 lg:p-8 ${plusJakartaSans.className}`}>
          {children}
        </main>
      </div>
    </div>
  );
}