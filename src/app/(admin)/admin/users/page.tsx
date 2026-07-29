"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  type: "Talent" | "Employer" | "Admin";
  status: "Active" | "Inactive" | "Suspended";
  verification: "Verified" | "Pending" | "Unverified";
}

const mockUsers: UserRecord[] = [
  { id: "1", name: "Ella ThankGod", email: "ella.thankgod@example.com", type: "Talent", status: "Active", verification: "Verified" },
  { id: "2", name: "Kofi Mensah", email: "kofi.mensah@example.com", type: "Employer", status: "Inactive", verification: "Pending" },
  { id: "3", name: "Fatima Yusuf", email: "fatima.yusuf@example.com", type: "Talent", status: "Suspended", verification: "Unverified" },
  { id: "4", name: "Amara Chukwu", email: "amara@example.com", type: "Talent", status: "Active", verification: "Verified" },
  { id: "5", name: "David Okafor", email: "david.okafor@example.com", type: "Employer", status: "Active", verification: "Verified" },
  { id: "6", name: "Grace Wanjiru", email: "grace.wanjiru@example.com", type: "Talent", status: "Active", verification: "Pending" },
  { id: "7", name: "Samuel Boateng", email: "samuel.boateng@example.com", type: "Employer", status: "Inactive", verification: "Unverified" },
  { id: "8", name: "Zainab Ibrahim", email: "zainab.ibrahim@example.com", type: "Admin", status: "Active", verification: "Verified" },
  { id: "9", name: "Michael Adeyemi", email: "michael.adeyemi@example.com", type: "Talent", status: "Suspended", verification: "Pending" },
  { id: "10", name: "Naledi Mokoena", email: "naledi.mokoena@example.com", type: "Talent", status: "Active", verification: "Verified" },
  { id: "11", name: "Tunde Bakare", email: "tunde.bakare@example.com", type: "Employer", status: "Active", verification: "Verified" },
  { id: "12", name: "Chidinma Eze", email: "chidinma.eze@example.com", type: "Talent", status: "Inactive", verification: "Unverified" },
];

const PAGE_SIZE = 20;

const statusStyles: Record<UserRecord["status"], string> = {
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
  Suspended: "bg-red-50 text-red-600",
};

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");
}

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        search.trim() === "" ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All types" || user.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  // keep page in range if filtering shrinks the result set below the current page
  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const startIndex = filteredUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredUsers.length);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1); // reset to page 1 whenever the search changes, so you don't land on an empty page
  }

  function handleTypeFilterChange(value: string) {
    setTypeFilter(value);
    setPage(1);
  }

  return (
    <>
      <div className="bg-gray-50 overflow-hidden ">
        <h1 className="text-2xl font-bold text-black">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage candidates, recruiters and admin access permissions.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 sm:max-w-xs">
            <Search size={16} className="shrink-0 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => handleTypeFilterChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pr-9 pl-4 text-sm text-gray-700 outline-none sm:w-40"
            >
              <option>All types</option>
              <option>Talent</option>
              <option>Employer</option>
              <option>Admin</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPage(1)}
          className="shrink-0 rounded-xl bg-[#8A38F5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0]"
        >
          Apply Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Type</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Verification</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDE7F8] text-xs font-semibold text-[#8A38F5]">
                      {getInitials(user.name)}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.type}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.verification}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    className="rounded-lg border border-[#8A38F5] px-4 py-1.5 text-xs font-semibold text-[#8A38F5] transition-colors hover:bg-[#8A38F5] hover:text-white"
                  >
                    View profile
                  </button>
                </td>
              </tr>
            ))}

            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                  No users match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
          <p className="text-sm text-gray-400">
            {/* {filteredUsers.length === 0
              ? "No users found"
              : `Showing ${startIndex}-${endIndex} of ${filteredUsers.length} users`} */}
          </p>
          <div className="flex gap-2">
           {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:border-gray-200 disabled:hover:bg-transparent"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:border-gray-200 disabled:hover:bg-transparent"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}