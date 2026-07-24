import { User } from "lucide-react";
import { CircularProgress } from "./CircularProgress";

export function ProfileCompletionCard({ percentage }: { percentage: number }) {
  return (
    <div className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:border-[#8A38F5]/30 hover:shadow-xl hover:shadow-[#8A38F5]/10  relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8A38F5] to-[#5A31C3] p-5 text-white">
      <div className="flex items-start justify-between">
        {/* <div className="relative h-16 w-16">
          <CircularProgress percentage={percentage} size={64} strokeWidth={6} />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {percentage}%
          </span>
        </div> */}

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
          <User size={18} />
        </div>
      </div>

      <p className="mt-5 text-2xl font-bold">{percentage}%</p>
      <p className="text-sm font-medium">Profile completion</p>
      <p className="mt-1 text-xs text-white/70">
        {percentage < 100 ? "Complete your profile to apply" : "Profile complete"}
      </p>
    </div>
  );
}