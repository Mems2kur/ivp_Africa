"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { adminUsersApi, type AdminUserView } from "@/lib/api/adminUsers";
import { useSession } from "@/lib/auth/useSession";
import { auditLogsApi } from "@/lib/api/auditLogs";
const roleLabels: Record<AdminUserView["role"], string> = {
  talent: "Talent",
  employer: "Employer",
  admin: "Admin",
};

function getInitials(name: string) {
  if (!name?.trim()) return "?";
  return name.trim().split(/\s+/).map((p) => p[0]?.toUpperCase()).slice(0, 2).join("");
}

export default function AdminUserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [user, setUser] = useState<AdminUserView | null>(null);
  const [notFound, setNotFound] = useState(false);

  function refresh() {
    if (!id) return;
    const found = adminUsersApi.getById(id);
    if (!found) {
      setNotFound(true);
      return;
    }
    setUser(found);
  }

  useEffect(() => {
    refresh();
  }, [id]);

  const { session } = useSession();

function handleToggleStatus(user: AdminUserView) {
  const nextStatus = user.status === "active" ? "suspended" : "active";
  adminUsersApi.setStatus(user.id, nextStatus);
  auditLogsApi.add(
    session?.displayName ?? "Admin",
    nextStatus === "suspended" ? "Suspended account" : "Reactivated account",
    user.displayName
  );
  refresh();
}
  if (notFound) {
    return (
      <div>
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Back to User Management
        </button>
        <p className="text-sm text-gray-400">No user found with this ID.</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => router.push("/admin/users")}
        className="flex w-fit items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to User Management
      </button>

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EDE7F8] text-lg font-semibold text-[#8A38F5]">
            {getInitials(user.displayName)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.displayName}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Type</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{roleLabels[user.role]}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Status</p>
            <p className={`mt-1 text-sm font-semibold ${user.status === "active" ? "text-green-700" : "text-red-600"}`}>
              {user.status === "active" ? "Active" : "Suspended"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Verification</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{user.verification}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <h2 className="text-sm font-bold text-gray-900">Account access</h2>
          <p className="mt-1 text-sm text-gray-500">
            {user.status === "active"
              ? "This account can currently log in and use the platform normally."
              : "This account is suspended and cannot access the platform."}
          </p>
          <button
            type="button"
            onClick={() => handleToggleStatus(user)}
            className={`mt-4 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors ${
              user.status === "active"
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {user.status === "active" ? "Suspend this account" : "Reactivate this account"}
          </button>
        </div>
      </div>
    </div>
  );
}