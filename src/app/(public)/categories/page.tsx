import type { Metadata } from 'next';
import BrowseCategories from '@/pages/BrowseCategoriesPage';

export const metadata: Metadata = {
  title: 'Categories | Browse Our Products',
  description: 'Discover thousands of job opportunities tailored to your expertise. Whether you\'re a creative, an engineer, or a strategist, your next role is here..',
  alternates: {
    canonical: '/categories',
  },
};

export default function Page() {
  return <BrowseCategories />;
}