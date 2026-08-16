import { adminUsersApi } from "@/lib/api/adminUsers";
import { employerJobsApi } from "@/lib/api/employerJob";
import { companyProfileApi } from "@/lib/api/companyProfile";
import { jobsApi, type RealJob } from "@/lib/api/jobs";

export interface TalentJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDaysAgo: number;
  deadline: string;
  category: string;
  companyEmployees: string;
  verifiedEmployer: boolean;
  initial: string;
  status: "active" | "filled" | "flagged";
  source: "employer" | "backend";
  employerEmail?: string;
}

function daysAgo(iso: string): number {
  const diffMs = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diffMs / 86400_000));
}

function fromEmployerJob(job: ReturnType<typeof employerJobsApi.getAll>[number], employerEmail: string): TalentJob {
  const company = companyProfileApi.get(employerEmail, "");
  return {
    id: job.id,
    title: job.title,
    company: company.companyName || "Unnamed Company",
    location: job.location,
    type: job.workMode,
    level: job.department || "Not specified",
    salary: job.minSalary && job.maxSalary ? `${job.minSalary} - ${job.maxSalary}` : "Not specified",
    description: job.description || "No description provided.",
    requirements: job.skills.length > 0 ? job.skills : ["Not specified"],
    postedDaysAgo: daysAgo(job.postedOn),
    deadline: job.deadline || "Not specified",
    category: job.department || "General",
    companyEmployees: "Not specified",
    verifiedEmployer: company.verified,
    initial: (company.companyName || "?").trim()[0]?.toUpperCase() ?? "?",
    status: "active",
    source: "employer",
    employerEmail,
  };
}

function fromRealJob(job: RealJob): TalentJob {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.jobType,
    level: job.experienceLevel,
    salary: job.salary,
    description: job.description,
    requirements: ["See description"],
    postedDaysAgo: 0,
    deadline: "Not specified",
    category: job.jobType,
    companyEmployees: "Not specified",
    verifiedEmployer: false,
    initial: (job.company || "?").trim()[0]?.toUpperCase() ?? "?",
    status: "active",
    source: "backend",
  };
}

export const talentJobsApi = {
  getAll: async (): Promise<TalentJob[]> => {
    const employers = adminUsersApi.getAll().filter((u) => u.role === "employer");
    const employerJobs: TalentJob[] = [];
    employers.forEach((emp) => {
      const jobs = employerJobsApi.getAll(emp.email).filter((j) => j.status === "active");
      jobs.forEach((job) => employerJobs.push(fromEmployerJob(job, emp.email)));
    });

    let backendJobs: TalentJob[] = [];
    const searchResult = await jobsApi.search();
    if (searchResult.ok) {
      backendJobs = searchResult.jobs.map(fromRealJob);
    }

    return [...backendJobs, ...employerJobs];
  },

  getById: async (id: string): Promise<TalentJob | null> => {
    const all = await talentJobsApi.getAll();
    return all.find((j) => j.id === id) ?? null;
  },
};