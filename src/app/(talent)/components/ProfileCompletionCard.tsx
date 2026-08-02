import { User } from "lucide-react";
import { CircularProgress } from "./CircularProgress";

export function ProfileCompletionCard({ percentage }: { percentage: number }) {
  return (
    <div className="group flex cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-br from-[#8E66FF] to-[#6C3CFF] p-4 text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#6C3CFF]/30 sm:p-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 transition-colors duration-200 group-hover:bg-white/30 sm:h-11 sm:w-11">
        <User size={17} className="text-white sm:size-[19px]" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold sm:text-xl">{percentage}%</p>
        <p className="truncate text-xs text-white/80 sm:text-sm">
          {percentage < 100 ? "Complete your profile to apply" : "Profile complete"}
        </p>
      </div>
    </div>
  );
}