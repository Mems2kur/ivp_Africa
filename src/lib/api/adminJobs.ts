import { jobs, type Job } from "@/app/(talent)/talent/jobs/job";

export type AdminJobStatus = "active" | "filled" | "flagged";

interface JobOverride {
  status: AdminJobStatus;
}

const STORAGE_KEY = "ivp_admin_job_overrides";

function readOverrides(): Record<string, JobOverride> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeOverrides(overrides: Record<string, JobOverride>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export interface AdminJobView extends Job {
  status: AdminJobStatus;
}

export const adminJobsApi = {
  getAll(): AdminJobView[] {
    const overrides = readOverrides();
    return jobs.map((job) => ({
      ...job,
      status: overrides[job.id]?.status ?? "active",
    }));
  },

  getById(id: string): AdminJobView | null {
    const job = jobs.find((j) => j.id === id);
    if (!job) return null;
    const overrides = readOverrides();
    return { ...job, status: overrides[id]?.status ?? "active" };
  },

  setStatus(id: string, status: AdminJobStatus) {
    const overrides = readOverrides();
    overrides[id] = { status };
    writeOverrides(overrides);
  },
};