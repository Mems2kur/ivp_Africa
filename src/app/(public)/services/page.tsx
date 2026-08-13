import type { Metadata } from 'next';
import ServicesPage from '@/pages/ServicesPage';

export const metadata: Metadata = {
  title: 'Services | Our Offerings',
  description: 'Explore our comprehensive range of services designed to meet your business needs and drive growth.',
  alternates: {
    canonical: '/services',
  },
};

export default function Page() {
  return <ServicesPage />;
}