"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/useSession";

interface RequireRoleProps {
  role: "talent" | "employer" | "admin";
  children: React.ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.role !== role) {
      // logged in, but as the wrong role — send them to their own dashboard
      // instead of /login, since they DO have a valid account
      router.push(session.redirectPath ?? "/login");
    }
  }, [loading, session, role, router]);

  if (loading || !session || session.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#8A38F5]" />
      </div>
    );
  }

  return <>{children}</>;
}