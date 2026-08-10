"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { adminUsersApi, type AdminUserView } from "@/lib/api/adminUsers";
import { CandidateDetailView } from "./CandidateDetailView";
import { EmployerDetailView } from "./EmployerDetailView";

export default function AdminUserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [user, setUser] = useState<AdminUserView | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const found = adminUsersApi.getById(id);
    if (!found) {
      setNotFound(true);
      return;
    }
    setUser(found);
  }, [id]);

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

  if (user.role === "employer") return <EmployerDetailView user={user} />;
  return <CandidateDetailView user={user} />; // talent AND admin both get the candidate-style view for now
}