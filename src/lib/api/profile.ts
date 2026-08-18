import type { CandidateProfileData } from "@/lib/types/Profile";
import { session } from "@/lib/auth/session";
import { apiFetch } from "./httpClient";

const STORAGE_PREFIX = "ivp_profile_";
interface ProfileCompletionMeta {
  profilePercent?: number;
  isComplete?: boolean;
}

function authHeaders(): HeadersInit {
  const current = session.get();

  console.log("Current session:", current);
  console.log("Access token exists:", !!current?.accessToken);

  return current?.accessToken
    ? {
        Authorization: `Bearer ${current.accessToken}`,
      }
    : {};
}
function keyFor(email: string) {
  return `${STORAGE_PREFIX}${email.toLowerCase()}`;
}

export const ProfileApi_real ={

 updatePersonalInfo: async (input: {
  professionalTitle: string;
  bio: string;
  location: string;
  profileImageUrl:string,
}) => {
  const result = await apiFetch<{ message?: string } & ProfileCompletionMeta>("/api/v1/talent/profile/personal", {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  return result.ok
    ? { ok: true as const, profilePercent: result.data.profilePercent, isComplete: result.data.isComplete }
    : { ok: false as const, message: result.message };
},

addExperience: async (input: { company: string; role: string; startDate: string }) => {
  const result = await apiFetch<{ message?: string } & ProfileCompletionMeta>("/api/v1/talent/profile/experience", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  return result.ok
    ? { ok: true as const, profilePercent: result.data.profilePercent, isComplete: result.data.isComplete }
    : { ok: false as const, message: result.message };
},

addEducation: async (input: {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
}) => {
  const result = await apiFetch<{ message?: string } & ProfileCompletionMeta>(
    "/api/v1/talent/profile/education",
    { method: "POST", headers: authHeaders(), body: JSON.stringify(input) }
  );
  return result.ok
    ? { ok: true as const, profilePercent: result.data.profilePercent, isComplete: result.data.isComplete }
    : { ok: false as const, message: result.message };
},

updateSkills: async (input: {
  skills: string[];
  certifications: string[];
  portfolioUrl: string;
  resumeUrl: string;
}) => {
  const result = await apiFetch<{ message?: string } & ProfileCompletionMeta>("/api/v1/talent/profile/skills", {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  return result.ok
    ? { ok: true as const, profilePercent: result.data.profilePercent, isComplete: result.data.isComplete }
    : { ok: false as const, message: result.message };
},
updateEmploymentPreferences: async (input: {
  preferredJobType: string;
  preferredLocation: string;
  expectedSalary: string;
  availability: string;
}) => {
  const result = await apiFetch<{ message?: string } & ProfileCompletionMeta>(
    "/api/v1/talent/profile/employment-preferences",
    { method: "PUT", headers: authHeaders(), body: JSON.stringify(input) }
  );
  return result.ok
    ? { ok: true as const, profilePercent: result.data.profilePercent, isComplete: result.data.isComplete }
    : { ok: false as const, message: result.message };
},
}

export const profileApi = {
  get(email: string): CandidateProfileData | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(keyFor(email));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save(email: string, data: CandidateProfileData) {
    localStorage.setItem(keyFor(email), JSON.stringify(data));
  },
};