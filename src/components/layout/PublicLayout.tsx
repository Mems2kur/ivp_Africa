"use client";

import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="min-h-[calc(100vh-16rem)] bg-[#f8fafc]">{children}</main>
      <Footer />
    </>
  );
}
