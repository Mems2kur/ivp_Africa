export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: "applied" | "shortlisted" | "interview" | "rejected";
  appliedAt: string; // ISO date
  cvFileName?: string;
}

export interface SavedJobRecord {
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  savedAt: string;
}