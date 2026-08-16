import { apiFetch } from "@/lib/api/httpClient";
import { session } from "@/lib/auth/session";

function authHeaders(): HeadersInit {
  const current = session.get();
  return current?.accessToken ? { Authorization: `Bearer ${current.accessToken}` } : {};
}

export interface RealJob {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: string;
  description: string;
}

function normalizeJob(raw: any): RealJob {
  return {
    id: raw.id ?? raw._id ?? "",
    title: raw.title ?? raw.jobTitle ?? "Untitled role",
    company: raw.company ?? raw.companyName ?? "Unknown company",
    location: raw.location ?? "Not specified",
    jobType: raw.jobType ?? raw.type ?? "Not specified",
    experienceLevel: raw.experienceLevel ?? raw.level ?? "Not specified",
    salary: raw.salary ?? raw.salaryRange ?? "Not specified",
    description: raw.description ?? "",
  };
}

export interface SearchFilters {
  jobType?: string;
  location?: string;
  experienceLevel?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const jobsApi = {
  search: async (filters: SearchFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const query = params.toString() ? `?${params.toString()}` : "";

    const result = await apiFetch<{ message: string; data: any[] }>(`/api/v1/jobs/search${query}`);

    if (!result.ok) {
      return { ok: false as const, message: result.message };
    }
    return { ok: true as const, jobs: result.data.data.map(normalizeJob), message: result.data.message };
  },

  apply: async (jobId: string) => {
    const result = await apiFetch<{
      message: string;
      applicationId: string;
      status: string;
      appliedAt: string;
    }>(`/api/v1/applications/apply/${jobId}`, {
      method: "POST",
      headers: authHeaders(),
    });

    if (!result.ok) {
      return { ok: false as const, message: result.message };
    }
    return { ok: true as const, ...result.data };
  },

  saveJob: async (jobId: string) => {
    const result = await apiFetch<{ message: string }>(`/api/v1/jobs/saved/${jobId}`, {
      method: "POST",
      headers: authHeaders(),
    });
    return result.ok ? { ok: true as const } : { ok: false as const, message: result.message };
  },

  getSavedJobs: async () => {
    const result = await apiFetch<{ data: any[] }>("/api/v1/jobs/saved", {
      headers: authHeaders(),
    });
    if (!result.ok) {
      return { ok: false as const, message: result.message };
    }
    return { ok: true as const, jobs: result.data.data.map(normalizeJob) };
  },

  removeSavedJob: async (jobId: string) => {
    const result = await apiFetch<{ message: string }>(`/api/v1/jobs/saved/${jobId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return result.ok ? { ok: true as const } : { ok: false as const, message: result.message };
  },
};