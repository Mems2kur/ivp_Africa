import type { CandidateProfileData } from "@/lib/types/Profile";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export function getProfileCompletion(data: CandidateProfileData | null) {
  const checklist: ChecklistItem[] = [
    {
      id: "basic-info",
      label: "Basic info",
      done: Boolean(data?.personalInfo?.fullName && data?.personalInfo?.location),
    },
    {
      id: "education",
      label: "Education",
      done: Boolean(data?.education?.institution && data?.education?.courseOfStudy),
    },
    {
      id: "skills",
      label: "Top skills",
      done: Boolean(data?.skillsAndDocuments?.skills?.some((s) => s.trim() !== "")),
    },
    {
      id: "cv",
      label: "Add resume link",
      done: Boolean(data?.skillsAndDocuments?.resumeUrl?.trim()),
    },
  ];

  const doneCount = checklist.filter((c) => c.done).length;
  const percentage = Math.round((doneCount / checklist.length) * 100);

  return { checklist, percentage };
}