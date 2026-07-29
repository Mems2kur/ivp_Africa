import { jobs } from "@/app/(talent)/talent/jobs/job";
import { notificationsApi } from "@/lib/api/notification";

export interface UpdateItem {
  id: string;
  title: string;
  description: string;
  timestamp: string; // ISO date, used for sorting only
}

export function getLatestUpdates(email: string, limit = 4): UpdateItem[] {
  // Source 1: real notifications (applying, messaging, profile saves, etc.)
  const fromNotifications: UpdateItem[] = notificationsApi.getAll(email).map((n) => ({
    id: n.id,
    title: n.message,
    description: "", // notifications are single-line; no separate description available
    timestamp: n.createdAt,
  }));

  // Source 2: newest job postings — approximate a real timestamp from postedDaysAgo
  // since job.ts only stores a relative day count, not an actual date
  const fromJobs: UpdateItem[] = jobs
    .filter((job) => job.postedDaysAgo <= 5) // only genuinely "recent" postings
    .map((job) => ({
      id: `job-${job.id}`,
      title: `New job: ${job.title}`,
      description: `${job.company} · ${job.location}`,
      timestamp: new Date(Date.now() - job.postedDaysAgo * 86_400_000).toISOString(),
    }));

  return [...fromNotifications, ...fromJobs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}