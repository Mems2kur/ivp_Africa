"use client";

import { useState } from "react";

interface PublicPage {
  id: string;
  title: string;
  lastUpdated: string;
  content: string;
}

const initialPages: PublicPage[] = [
  {
    id: "faqs",
    title: "FAQs",
    lastUpdated: "3 days ago",
    content: "Frequently asked questions content goes here...",
  },
  {
    id: "about",
    title: "About Us",
    lastUpdated: "2 weeks ago",
    content: "About IVP Africa content goes here...",
  },
  {
    id: "contact",
    title: "Contact Us",
    lastUpdated: "1 month ago",
    content: "Contact information content goes here...",
  },
];

export default function ContentManagementPage() {
  const [pages, setPages] = useState<PublicPage[]>(initialPages);
  const [editingPage, setEditingPage] = useState<PublicPage | null>(null);
  const [draftContent, setDraftContent] = useState("");

  const [announcement, setAnnouncement] = useState("");
  const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "published">("idle");

  function openEditModal(page: PublicPage) {
    setDraftContent(page.content);
    setEditingPage(page);
  }

  function handleSavePage() {
    if (!editingPage) return;
    setPages((prev) =>
      prev.map((p) =>
        p.id === editingPage.id
          ? { ...p, content: draftContent, lastUpdated: "Just now" }
          : p
      )
    );
    setEditingPage(null);
  }

  async function handlePublishAnnouncement() {
    if (!announcement.trim()) return;
    setPublishStatus("publishing");
    await new Promise((resolve) => setTimeout(resolve, 600)); // simulated save delay
    setPublishStatus("published");
    setTimeout(() => setPublishStatus("idle"), 2000);
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Content Management</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Edit public-facing FAQ, About Us, and Contact information.
        </p>
      </div>

      {/* Public Pages */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Public Pages</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 pr-4 text-xs font-medium text-gray-400">Page</th>
                <th className="hidden py-3 pr-4 text-xs font-medium text-gray-400 sm:table-cell">Last updated</th>
                <th className="py-3 text-right text-xs font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((page) => (
                <tr key={page.id} className="transition-colors hover:bg-gray-50">
                  <td className="py-4 pr-4">
                    <p className="text-sm font-semibold text-gray-900">{page.title}</p>
                    <p className="text-xs text-gray-400 sm:hidden">{page.lastUpdated}</p>
                  </td>
                  <td className="hidden py-4 pr-4 text-sm text-gray-400 sm:table-cell">{page.lastUpdated}</td>
                  <td className="py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEditModal(page)}
                      className="rounded-lg bg-[#EDE7F8] px-4 py-1.5 text-xs font-semibold text-[#8A38F5] transition-colors hover:bg-[#DCCFF5]"
                    >
                      Edit page
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Announcements */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">System Announcements</h2>

        <label className="mb-2 block text-sm font-medium text-gray-700">Announcement Message</label>
        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Type the announcement message..."
          rows={5}
          className="w-full resize-none rounded-xl border border-[#EBF0F5] bg-[#F5F6FA] p-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#8A38F5] focus:bg-white"
        />

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handlePublishAnnouncement}
            disabled={!announcement.trim() || publishStatus === "publishing"}
            className="rounded-xl bg-[#6C3CFF] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {publishStatus === "publishing"
              ? "Publishing…"
              : publishStatus === "published"
                ? "Published ✓"
                : "Publish Announcement"}
          </button>
        </div>
      </div>

      {/* Edit page modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">Edit {editingPage.title}</h3>
            <p className="mt-1 text-xs text-gray-400">Last updated {editingPage.lastUpdated}</p>

            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              rows={8}
              className="mt-4 w-full resize-none rounded-xl border border-gray-200 p-4 text-sm text-gray-900 outline-none focus:border-[#8A38F5]"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePage}
                className="flex-1 rounded-xl bg-[#6C3CFF] py-2.5 text-sm font-semibold text-white hover:bg-[#7226e0]"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}