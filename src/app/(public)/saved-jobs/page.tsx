import type { Metadata } from 'next';
import SavedJobs from '@/pages/SavedJobsPage';

export const metadata: Metadata = {
  title: 'Saved Jobs | Your Job Search',
  description: 'View and manage your saved job listings.',
  alternates: {
    canonical: '/saved-jobs',
  },
};

export default function Page() {
  return <SavedJobs />;
}