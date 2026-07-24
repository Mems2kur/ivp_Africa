interface ChecklistItem {
  id: number;
  label: string;
  done: boolean;
}

export function ProfileCompletionPanel({
  checklist,
}: {
  checklist: ChecklistItem[];
}) {
  return (
    <div className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-2xl border border-[#EDE7F8] bg-gradient-to-br from-[#F5F3FA] to-[#EDE7F8] p-6">
      <h2 className="text-lg font-bold text-gray-900">Finish your profile</h2>
      <p className="mt-1 text-sm text-gray-500">
        A few steps left to stand out to employers.
      </p>

      <ul className="mt-5 space-y-3">
        {checklist.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                item.done ? "bg-gray-300" : "bg-[#8A38F5]"
              }`}
            />
            <span
              className={`text-sm ${
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
        className="mt-6 w-full rounded-full bg-[#8A38F5] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0]"
      >
        Complete profile
      </button>
    </div>
  );
}