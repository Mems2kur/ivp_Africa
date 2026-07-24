"use client";

import { User, Briefcase } from "lucide-react";

interface RoleToggleProps {
  value: "talent" | "employer";
  onChange: (role: "talent" | "employer") => void;
}

export function RoleToggle({ value, onChange }: RoleToggleProps) {
  return (
    <div className="flex gap-1 rounded-full bg-[#EDE7F8] p-1.5">
      <button
        type="button"
        onClick={() => onChange("talent")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all ${
          value === "talent"
            ? "bg-white text-[#8A38F5] shadow-sm"
            : "text-[#3A2680]/70 hover:text-[#3A2680]"
        }`}
      >
        <User size={16} />
        I&apos;m talent
      </button>
      <button
        type="button"
        onClick={() => onChange("employer")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all ${
          value === "employer"
            ? "bg-white text-[#8A38F5] shadow-sm"
            : "text-[#3A2680]/70 hover:text-[#3A2680]"
        }`}
      >
        <Briefcase size={16} />
        I&apos;m an employer
      </button>
    </div>
  );
}