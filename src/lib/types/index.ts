// Domain types derived from the PRD field-validation tables.
// These are the contracts the UI is built against until the backend
// publishes real API schemas — keep this file in sync with the API docs
// once Week 3 handoff happens.

export type UserRole = "candidate" | "employer" | "admin";

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "hired";

export type JobStatus = "draft" | "active" | "closed" | "filled";

export type EmploymentType = "full_time" | "contract" | "internship" | "gig";

export type WorkMode = "remote" | "hybrid" | "on_site";

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileCompletion: number; // 0-100
  skills: string[];
  cvUrl?: string;
  verifiedEmail: boolean;
}

export interface Employer {
  id: string;
  companyName: string;
  businessEmail: string;
  industry: string;
  companySize: string;
  verified: boolean;
  logoUrl?: string;
}

export interface Job {
  id: string;
  employerId: string;
  title: string;
  description: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  qualification: string;
  experienceLevel: string;
  vacancies: number;
  salary?: number;
  applicationDeadline: string; // ISO date
  status: JobStatus;
  skillsRequired: string[];
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string; // ISO date
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  benefits: string[];
}
