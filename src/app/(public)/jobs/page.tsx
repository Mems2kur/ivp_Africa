import type { Metadata } from "next";
import SearchJobsPage from '@/pages/SearchjobsPage';

export const metadata: Metadata = {
  title: 'Jobs | Internship Vault Program Africa',
  description: 'Browse our latest internship opportunities and find the perfect fit for your career.',
  alternates: {
    canonical: '/jobs',
  },
};

export default function Page() {
  return <SearchJobsPage />;
}
