import { jobs } from "@/app/(talent)/talent/jobs/job";

export interface TalentSearchResult {
  id: string;
  label: string;
  subtitle: string;
  href: string;
}

const talentTools: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/talent" },
  { label: "Jobs", href: "/talent/jobs" },
  { label: "Applications", href: "/talent/applications" },
  { label: "Notifications", href: "/talent/notifications" },
  { label: "Messages", href: "/talent/messages" },
  { label: "Profile", href: "/talent/profile" },
];

export function searchTalent(query: string): TalentSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const toolResults: TalentSearchResult[] = talentTools
    .filter((tool) => tool.label.toLowerCase().includes(q))
    .map((tool) => ({
      id: `tool-${tool.href}`,
      label: tool.label,
      subtitle: "Section",
      href: tool.href,
    }));

  const jobResults: TalentSearchResult[] = jobs
    .filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q)
    )
    .slice(0, 6)
    .map((job) => ({
      id: `job-${job.id}`,
      label: job.title,
      subtitle: `${job.company} · ${job.location}`,
      href: `/talent/jobs/${job.id}`,
    }));

  return [...toolResults, ...jobResults].slice(0, 8);
}