import type { Metadata } from 'next';
import ContactPage from '@/pages/ContactPage';

export const metadata: Metadata = {
  title: 'Contact | Get in Touch',
  description: 'Get in touch with us for any inquiries or service requests.',
  alternates: {
    canonical: '/contact',
  },
};

export default function Page() {
  return <ContactPage />;
}