import type { ApplicationRecord, SavedJobRecord } from "@/lib/types/application";
import { notificationsApi } from "@/lib/api/notification";
const APPLICATIONS_PREFIX = "ivp_applications_";
const SAVED_JOBS_PREFIX = "ivp_saved_jobs_";

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export const applicationsApi = {
  getAll(email: string): ApplicationRecord[] {
    return readList<ApplicationRecord>(APPLICATIONS_PREFIX + email.toLowerCase());
  },

  isApplied(email: string, jobId: string): boolean {
    return this.getAll(email).some((a) => a.jobId === jobId);
  },

  apply(
    email: string,
    job: { id: string; title: string; company: string; location: string },
    cvFileName?: string
  ): ApplicationRecord {
    const key = APPLICATIONS_PREFIX + email.toLowerCase();
    const applications = readList<ApplicationRecord>(key);

    const record: ApplicationRecord = {
      id: crypto.randomUUID(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      status: "applied",
      appliedAt: new Date().toISOString(),
      cvFileName,
    };

    writeList(key, [record, ...applications]);
    notificationsApi.add(email, `You applied to ${job.title} at ${job.company}`);
    return record;
  },
};

export const savedJobsApi = {
  getAll(email: string): SavedJobRecord[] {
    return readList<SavedJobRecord>(SAVED_JOBS_PREFIX + email.toLowerCase());
  },

  isSaved(email: string, jobId: string): boolean {
    return this.getAll(email).some((s) => s.jobId === jobId);
  },

  toggle(
    email: string,
    job: { id: string; title: string; company: string; location: string }
  ): boolean {
    const key = SAVED_JOBS_PREFIX + email.toLowerCase();
    const saved = readList<SavedJobRecord>(key);
    const exists = saved.some((s) => s.jobId === job.id);

    if (exists) {
      writeList(key, saved.filter((s) => s.jobId !== job.id));
      return false;
    }

    writeList(key, [
      { jobId: job.id, jobTitle: job.title, company: job.company, location: job.location, savedAt: new Date().toISOString() },
      ...saved,
    ]);
    return true;
  },
};