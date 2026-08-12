import type { Metadata } from "next";
import AboutPage from '@/pages/AboutPage';

export const metadata: Metadata = {
  title: 'About | Internship Vault Program Africa',
  description: 'Learn more about our mission, vision, and values.',
  alternates: {
    canonical: '/about',
  },
};

export default function Page() {
  return <AboutPage />;
}
