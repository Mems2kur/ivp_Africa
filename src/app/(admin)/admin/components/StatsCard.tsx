import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  variant?: "light" | "white";
}

export function StatsCard({ icon: Icon, value, label, variant = "light" }: StatsCardProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        variant === "white" ? "border border-gray-100 bg-white" : "bg-[#F3EEFC]"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
        <Icon size={18} className="text-[#8A38F5]" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-gray-900 sm:text-xl">{value}</p>
        <p className="text-xs text-gray-500 sm:text-sm">{label}</p>
      </div>
    </div>
  );
}