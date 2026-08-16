import type { Metadata } from "next";
import EmployersPage from '@/pages/EmployersPage';

export const metadata: Metadata = {
  title: 'Employers | Internship Vault Program Africa',
  description: 'Connect with top talent and expand your business with our employer services.',
  alternates: {
    canonical: '/employers',
  },
};

export default function Page() {
  return <EmployersPage />;
}
