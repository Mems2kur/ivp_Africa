export type EmployerJobStatus = "active" | "draft" | "closed";

export interface EmployerJob {
  id: string;
  title: string;
  location: string;
  workMode: string;
  department: string;
  description: string;
  minSalary: string;
  maxSalary: string;
  deadline: string;
  skills: string[];
  applicants: number;
  status: EmployerJobStatus;
  postedOn: string; // ISO date
}

const PREFIX = "ivp_employer_jobs_";

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

function readJobs(email: string): EmployerJob[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(email)) ?? "[]");
  } catch {
    return [];
  }
}

function writeJobs(email: string, jobs: EmployerJob[]) {
  localStorage.setItem(keyFor(email), JSON.stringify(jobs));
}

function seedJobs(): EmployerJob[] {
  return [
    { id: crypto.randomUUID(), title: "Senior Product Designer", location: "Lagos, Nigeria", workMode: "Remote", department: "Product", description: "", minSalary: "", maxSalary: "", deadline: "", skills: [], applicants: 45, status: "active", postedOn: "2024-05-26" },
    { id: crypto.randomUUID(), title: "Backend Engineer (Node.js)", location: "Accra, Ghana", workMode: "Full-time", department: "Engineering", description: "", minSalary: "", maxSalary: "", deadline: "", skills: [], applicants: 38, status: "active", postedOn: "2024-05-15" },
    { id: crypto.randomUUID(), title: "UI/UX Researcher", location: "Nairobi, Kenya", workMode: "Remote", department: "Product", description: "", minSalary: "", maxSalary: "", deadline: "", skills: [], applicants: 27, status: "active", postedOn: "2024-05-10" },
    { id: crypto.randomUUID(), title: "Data Analyst", location: "Cape Town, SA", workMode: "Hybrid", department: "Analytics", description: "", minSalary: "", maxSalary: "", deadline: "", skills: [], applicants: 19, status: "draft", postedOn: "2024-05-08" },
    { id: crypto.randomUUID(), title: "Personal Assistant", location: "Cairo, Egypt", workMode: "Full-time", department: "Admin", description: "", minSalary: "", maxSalary: "", deadline: "", skills: [], applicants: 12, status: "closed", postedOn: "2024-04-28" },
    { id: crypto.randomUUID(), title: "DevOps Engineer", location: "Lagos, Nigeria", workMode: "Remote", department: "Engineering", description: "", minSalary: "", maxSalary: "", deadline: "", skills: [], applicants: 31, status: "active", postedOn: "2024-04-20" },
  ];
}

export const employerJobsApi = {
  getAll(email: string): EmployerJob[] {
    const existing = readJobs(email);
    if (existing.length > 0) return existing;
    const seeded = seedJobs();
    writeJobs(email, seeded);
    return seeded;
  },

  getById(email: string, jobId: string): EmployerJob | null {
    const jobs = readJobs(email);
    return jobs.find((j) => j.id === jobId) ?? null;
  },

  create(email: string, job: Omit<EmployerJob, "id" | "postedOn" | "applicants">): EmployerJob {
    const jobs = readJobs(email);
    const newJob: EmployerJob = {
      ...job,
      id: crypto.randomUUID(),
      applicants: 0,
      postedOn: new Date().toISOString().slice(0, 10),
    };
    writeJobs(email, [newJob, ...jobs]);
    return newJob;
  },

  setStatus(email: string, jobId: string, status: EmployerJobStatus) {
    const jobs = readJobs(email);
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, status } : j));
    writeJobs(email, updated);
  },

  remove(email: string, jobId: string) {
    const jobs = readJobs(email);
    writeJobs(email, jobs.filter((j) => j.id !== jobId));
  },

  update(email: string, jobId: string, updates: Partial<Omit<EmployerJob, "id" | "postedOn">>) {
    const jobs = readJobs(email);
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, ...updates } : j));
    writeJobs(email, updated);
  },
};