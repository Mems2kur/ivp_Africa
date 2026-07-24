interface UpdateItem {
  id: number;
  title: string;
  description: string;
}

const updates: UpdateItem[] = [
  {
    id: 1,
    title: "You've been shortlisted",
    description: "FlutterHub shortlisted your application for Senior Product Designer.",
  },
  {
    id: 2,
    title: "New message from Paystash",
    description: "Interview confirmed for Thursday 10:00 EAT.",
  },
  {
    id: 3,
    title: "3 new jobs match your profile",
    description: "New roles in Technology across Nigeria and Kenya.",
  },
  {
    id: 4,
    title: "Profile is 80% complete",
    description: "Add a portfolio link to increase your visibility to employers.",
  },
];

export function LatestUpdates({ updates: items = updates }: { updates?: UpdateItem[] }) {
  return (
    <div className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-2xl border border-gray-100 bg-white p-6">
      <h2 className="mb-5 font-serif text-xl text-[#3A2680]">Latest updates</h2>

      <div className="flex flex-col gap-3 ">
        {items.map((update) => (
          <div
            key={update.id}
            className="rounded-xl border border-gray-100 bg-[#EDE7F8] p-4"
          >
            <p className="text-sm font-semibold text-[#3A2680]">{update.title}</p>
            <p className="mt-1 text-sm text-gray-500">{update.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}