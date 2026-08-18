export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
 status: "applied" | "shortlisted" | "interview" | "rejected" | "hired"; 
  appliedAt: string; // ISO date
  cvFileName?: string;
  employerEmail?: string;
}
export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "hired";


export interface RealApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
   location: string;
  appliedAt: string;
  interview?: {
    date: string;
    location?: string;
    meetingLink?: string;
    instructions?: string;
  };
}
export interface SavedJobRecord {
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  savedAt: string;
}