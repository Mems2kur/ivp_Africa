import { Sidebar } from "../sidebar/sideBar";
import { TopNavbar } from "../TopNavbar";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";

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
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - full height, left side */}
      <Sidebar />

      {/* Right column: navbar on top, dashboard below */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
       <TopNavbar section="Talent" title="Dashboard" userName="Amara Chukwu" />

        <main className={`flex-1 overflow-y-auto ${plusJakartaSans.className}`}>
          <div className="container mx-auto px-10 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}