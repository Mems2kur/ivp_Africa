import type { Metadata } from "next";
import HomePage from "@/pages/HomePage";

export const metadata: Metadata = {
  title: 'Home | Internship Vault Program Africa',
  description: 'Discover how our innovative solutions can drive your business forward.',
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return <HomePage />;
}
