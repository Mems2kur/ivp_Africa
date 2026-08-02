"use client";

import { useRouter } from "next/navigation";
import type { ChecklistItem } from "@/lib/utils/profileCompletion";

export function ProfileCompletionPanel({
  checklist,
}: {
  checklist: ChecklistItem[];
}) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-[#EDE7F8] bg-gradient-to-br from-[#F5F3FA] to-[#EDE7F8] p-4 transition-shadow duration-200 hover:shadow-md sm:p-6">
      <h2 className="text-sm font-bold text-gray-900 sm:text-base">Finish your profile</h2>
      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
        A few steps left to stand out to employers.
      </p>

      <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
        {checklist.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                item.done ? "bg-gray-300" : "bg-[#8A38F5]"
              }`}
            />
            <span
              className={`text-xs sm:text-sm ${
                item.done
                  ? "text-gray-400 line-through"
                  : "font-medium text-gray-900"
              }`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => router.push("/talent/Profile")}
        className="mt-5 w-full rounded-full bg-[#8A38F5] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#7226e0] sm:mt-6 sm:py-3 sm:text-sm"
      >
        Complete profile
      </button>
    </div>
  );
}