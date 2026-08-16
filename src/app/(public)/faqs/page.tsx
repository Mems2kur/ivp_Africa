import type { Metadata } from "next";
import FAQPage from '@/pages/FAQ';

export const metadata: Metadata = {
  title: 'FAQs | Internship Vault Program Africa',
  description: 'Find answers to frequently asked questions about our internship program.',
  alternates: {
    canonical: '/faqs',
  },
};

export default function Page() {
  return <FAQPage />;
}
