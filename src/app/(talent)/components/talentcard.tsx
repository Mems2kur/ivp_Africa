import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sublabel?: string;
}

export function StatCard({ icon: Icon, label, value, sublabel }: StatCardProps) {
  return (
    <div className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] container  group text-black cursor-pointer rounded-2xl border border-gray-100 bg-[#EDE7F8] p-4 shadow-sm shadow-[#8A38F5]/5 transition-all duration-300 ease-out sm:p-5 md:hover:-translate-y-1 md:hover:scale-[1.03] md:hover:border-[#8A38F5]/30 md:hover:shadow-xl md:hover:shadow-[#8A38F5]/10">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDE7F8] text-[#8A38F5] transition-colors sm:h-10 sm:w-10 md:group-hover:bg-[#8A38F5] md:group-hover:text-white">
        <Icon size={18} className="sm:hidden" />
        <Icon size={20} className="hidden sm:block" />
      </div>
      <p className="mt-3 text-xl font-bold text-balck transition-colors sm:mt-4 sm:text-2xl md:group-hover:text-black">
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-500 transition-colors sm:text-sm md:group-hover:text-black">
        {label}
      </p>
      {sublabel && (
        <p className="mt-0.5 text-[11px] text-gray-400 transition-colors sm:text-xs md:group-hover:text-black">
          {sublabel}
        </p>
      )}
    </div>
  );
}