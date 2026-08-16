export type PipelineStage = "New" | "Screening" | "Interview" | "Offered" | "Hired";


export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  description?: string;
}

export interface EmployerCandidate {
  id: string;
  name: string;
  role: string;
  stage: PipelineStage;
  appliedAt: string; // ISO date
  location: string;
  email: string;
  matchPercentage: number;
  about: string;
  experienceYears: number;
  availability: string;
  languages: string[];
  skills: string[];
  experience: ExperienceEntry[];
}

const PREFIX = "ivp_employer_candidates_";

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

function readCandidates(email: string): EmployerCandidate[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(email)) ?? "[]");
  } catch {
    return [];
  }
}

function writeCandidates(email: string, candidates: EmployerCandidate[]) {
  localStorage.setItem(keyFor(email), JSON.stringify(candidates));
}


export const employerCandidatesApi = {
 getAll(email: string): EmployerCandidate[] {
  return readCandidates(email);
},
   getById(email: string, candidateId: string): EmployerCandidate | null {
    const candidates = readCandidates(email);
    return candidates.find((c) => c.id === candidateId) ?? null;
  },
  

  setStage(email: string, candidateId: string, stage: PipelineStage) {
    const candidates = readCandidates(email);
    const updated = candidates.map((c) => (c.id === candidateId ? { ...c, stage } : c));
    writeCandidates(email, updated);
  },

  remove(email: string, candidateId: string) {
    const candidates = readCandidates(email);
    writeCandidates(email, candidates.filter((c) => c.id !== candidateId));
  },
};