"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  User,
  FileText,
  Bookmark,
  Bell,
  Settings,
  Menu,
  MessageSquare,
  X,
  LogOut,
} from "lucide-react";

import { navItems } from "../data/data";
import { Home } from "lucide-react"; // correct
const icons: Record<string, React.ElementType> = {
  "/talent": LayoutDashboard,
  "/talent/Profile": User,
  "/talent/applications": FileText,
  "/talent/jobs": Bookmark,
  "/talent/notifications": Bell,
  "/talent/messages": MessageSquare,
  "/talent/settings": Settings,


};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  function isActive(link: string) {
    if (link === "/talent") return pathname === "/talent";
    return pathname.startsWith(link);
  }
function handleLogout() {
    // TODO: clear real session/auth state here once login actually exists.
    window.location.href = "/login";
  }
  return (
    <div className="font-sans  ">
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-[#8A38F5] text-white shadow md:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed border border-t-r border-2 rounded-r-3xl top-0 left-0 z-50 h-full w-64 border-r border-gray-100 bg-white
          flex flex-col transition-transform duration-300
          md:static md:z-auto md:h-screen md:flex-shrink-0 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-2">
        
         <div className="flex items-center justify-center ml-10">
           <Image
         alt=""
         width={100}
         height={100}
         className=" w-20 h-20"
         src="/img_ivp/ivp_logo.png"
         />
         </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[10px] font-medium tracking-widest text-gray-400 uppercase">
            Talent portal
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = icons[item.href];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex w-full items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-[16px] transition-colors duration-150
                      ${
                        isActive(item.href)
                          ? "border-[#8A38F5] bg-[#8A38F5] font-medium text-[#EDE7F8] hover:bg-[#3A2680] hover:text-[18px]"
                          : "border-transparent text-gray-600 hover:bg-[#EDE7F8]/60 hover:text-[#3A2680]"
                      }
                    `}
                  >
                    <span className="flex-shrink-0">
                      <Icon size={18} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {/* Footer */}
        <div className="border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
        <div className="border-t  border-gray-100 px-4 py-3 text-center text-[11px] text-gray-300">
          IVP Africa — talent placement platform
        </div>
      </aside>
    </div>
  );
}