"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Broadcast {
  id: string;
  message: string;
  audience: string;
  status: "Delivered" | "Draft" | "Sending";
}

const initialHistory: Broadcast[] = [
  { id: "1", message: "Platform maintenance notice", audience: "All users", status: "Delivered" },
  { id: "2", message: "New subscription plans available", audience: "Employers", status: "Draft" },
];

const audienceOptions = ["All Users", "Talent", "Employers", "Admins"];

const statusStyles: Record<Broadcast["status"], string> = {
  Delivered: "bg-green-50 text-green-700",
  Draft: "bg-amber-50 text-amber-700",
  Sending: "bg-blue-50 text-blue-700",
};

export default function AdminNotificationsPage() {
  const [audience, setAudience] = useState(audienceOptions[0]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<Broadcast[]>(initialHistory);

  async function handleSend() {
    if (!message.trim()) return;

    const id = crypto.randomUUID();
    const newBroadcast: Broadcast = {
      id,
      message: message.trim(),
      audience,
      status: "Sending",
    };

    setHistory((prev) => [newBroadcast, ...prev]);
    setSending(true);

    // simulated send delay — swap for a real API call once one exists
    await new Promise((resolve) => setTimeout(resolve, 800));

    setHistory((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Delivered" as const } : b))
    );
    setSending(false);
    setMessage("");
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Notifications</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Compose and send platform-wide announcements.
        </p>
      </div>

      {/* Compose */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Compose Platform Broadcast</h2>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Target Audience</label>
          <div className="relative">
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 outline-none focus:border-[#8A38F5] focus:bg-white"
            >
              {audienceOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Notification Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Notification Message textarea"
            rows={5}
            className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#8A38F5] focus:bg-white"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="rounded-xl bg-[#6C3CFF] px-6 py-2.5 text-sm font-semibold !text-white transition-colors hover:bg-[#7226e0] "
          >
            {sending ? "Sending…" : "Send Broadcast Alert"}
          </button>
        </div>
      </div>

      {/* Delivery History */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Delivery History</h2>

        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">No broadcasts sent yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 pr-4 text-xs font-medium text-gray-400">Message</th>
                  <th className="hidden py-3 pr-4 text-xs font-medium text-gray-400 sm:table-cell">Audience</th>
                  <th className="py-3 text-right text-xs font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <p className="text-sm font-semibold text-gray-900">{item.message}</p>
                      <p className="text-xs text-gray-400 sm:hidden">{item.audience}</p>
                    </td>
                    <td className="hidden py-3 pr-4 text-sm text-gray-500 sm:table-cell">{item.audience}</td>
                    <td className="py-3 text-right">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}