import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sublabel?: string;
}

export function StatCard({ icon: Icon, label, value, sublabel }: StatCardProps) {
  return (
    <div className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-100 bg-[#EDE7F8] p-4 text-gray-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#8A38F5]/10 sm:p-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#8A38F5] transition-colors duration-200 group-hover:bg-[#8A38F5] group-hover:text-white sm:h-11 sm:w-11">
        <Icon size={17} className="sm:size-[19px]" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold sm:text-xl">{value}</p>
        <p className="truncate text-xs text-gray-500 sm:text-sm">{label}</p>
        {sublabel && <p className="truncate text-[11px] text-gray-400">{sublabel}</p>}
      </div>
    </div>
  );
}