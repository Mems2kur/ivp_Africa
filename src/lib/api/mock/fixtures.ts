import type { Application, Candidate, Employer, Job, SubscriptionPlan } from "@/lib/types";

// Placeholder data ONLY. Swap the functions in `client.ts` for real fetch
// calls once the backend publishes endpoints — nothing else in the app
// should need to change if the function signatures stay the same.
export interface AuthAccount {
  email: string;
  password: string;
  role: "talent" | "employer" | "admin";
  emailVerified: boolean;
  redirectPath: string;
  displayName: string;
}
export const mockAuthAccounts: AuthAccount[] = [
  {
    email: "amara@example.com",
    password: "Password1!",
    role: "talent",
    emailVerified: true,
    redirectPath: "/talent",
    displayName: "Amara Chukwu",
  },
  {
    email: "admin@ivpafrica.com",
    password: "AdminPass1!",
    role: "admin",
    emailVerified: true,
    redirectPath: "/admin",
    displayName: "Admin",
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: "cand_1",
    firstName: "Amara",
    lastName: "Chukwu",
    email: "amara@example.com",
    profileCompletion: 80,
    skills: ["React", "TypeScript", "Figma"],
    verifiedEmail: true,
  },
];

export const mockEmployers: Employer[] = [
  {
    id: "emp_1",
    companyName: "Lagos Tech Hub",
    businessEmail: "hr@lagostechhub.com",
    industry: "Technology",
    companySize: "11-50",
    verified: true,
  },
];

export const mockJobs: Job[] = [
  {
    id: "job_1",
    employerId: "emp_1",
    title: "Frontend Engineering Intern",
    description: "Support the web team building the candidate portal.",
    employmentType: "internship",
    workMode: "hybrid",
    location: "Lagos, NG",
    qualification: "BSc in progress or completed",
    experienceLevel: "Entry",
    vacancies: 2,
    applicationDeadline: "2026-09-30",
    status: "active",
    skillsRequired: ["React", "Tailwind CSS"],
  },
];

export const mockApplications: Application[] = [
  {
    id: "app_1",
    jobId: "job_1",
    candidateId: "cand_1",
    status: "applied",
    appliedAt: "2026-08-01",
  },
];
export const MOCK_OTP = "123456";
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  { id: "plan_3m", name: "Starter", durationMonths: 3, price: 15000, benefits: ["5 active job posts"] },
  { id: "plan_12m", name: "Growth", durationMonths: 12, price: 50000, benefits: ["Unlimited job posts", "Priority support"] },
];
