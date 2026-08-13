import type { Metadata } from "next";
import PrivacyPolicyPage from '@/pages/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy | Internship Vault Program Africa',
  description: 'Learn about our privacy practices and how we protect your information.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
