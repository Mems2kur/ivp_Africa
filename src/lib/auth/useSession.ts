"use client";

import { useEffect, useState } from "react";
import { session, type Session } from "@/lib/auth/session";

export function useSession() {
  const [data, setData] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setData(session.get());
  setLoading(false);

  const unsubscribe = session.subscribe(setData);
  return () => {
    unsubscribe();
      };
}, []);

  return { session: data, loading };
}