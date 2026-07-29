"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/useSession";
import { getLatestUpdates, type UpdateItem } from "@/lib/utils/dashboardUpdates";

export function LatestUpdates() {
  const { session } = useSession();
  const [updates, setUpdates] = useState<UpdateItem[]>([]);

  useEffect(() => {
    if (!session?.email) return;
    setUpdates(getLatestUpdates(session.email));
  }, [session?.email]);

  return (
    <div className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-2xl border border-gray-100 bg-white p-6">
      <h2 className="mb-5 font-serif text-xl text-[#3A2680]">Latest updates</h2>

      {updates.length === 0 ? (
        <p className="text-sm text-gray-400">No updates yet — start applying to see activity here.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {updates.map((update) => (
            <div key={update.id} className="rounded-xl border border-gray-100 bg-[#EDE7F8] p-4">
              <p className="text-sm font-semibold text-[#3A2680]">{update.title}</p>
              {update.description && (
                <p className="mt-1 text-sm text-gray-500">{update.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}