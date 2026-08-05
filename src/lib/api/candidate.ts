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

function seedCandidates(): EmployerCandidate[] {
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(),
      name: "Chinedu Okafor",
      role: "Front-End Developer",
      stage: "Hired",
      appliedAt: new Date(now - 8 * 3600_000).toISOString(),
      location: "Lagos, Nigeria",
      email: "chinedu@technova.com",
      matchPercentage: 82,
      about: "Frontend developer with 4+ years of experience building scalable, responsive web applications. Highly focused on clean UI syntax, micro-interactions, and visual fidelity.",
      experienceYears: 4.5,
      availability: "Immediate",
      languages: ["English", "Yoruba"],
      skills: ["React", "TypeScript", "Tailwind CSS", "Figma", "REST APIs", "Node.js", "Git", "Redux"],
      experience: [
        { title: "Senior Frontend Developer", company: "Vatebra Tech", period: "2022 - Present", description: "Led development on enterprise portal refactoring." },
        { title: "UI Developer", company: "PayStack Ltd", period: "2020 - 2022" },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Genevive Mensah",
      role: "Website Researcher",
      stage: "Screening",
      appliedAt: new Date(now - 1 * 86400_000).toISOString(),
      location: "Accra, Ghana",
      email: "genevive@example.com",
      matchPercentage: 74,
      about: "Detail-oriented researcher with a background in UX research and content strategy.",
      experienceYears: 2,
      availability: "2 weeks notice",
      languages: ["English", "Twi"],
      skills: ["User Research", "Figma", "Notion", "Google Analytics"],
      experience: [
        { title: "Junior UX Researcher", company: "Freelance", period: "2023 - Present" },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Gideon Pryce",
      role: "Front-End Developer",
      stage: "Interview",
      appliedAt: new Date(now - 1 * 86400_000).toISOString(),
      location: "Nairobi, Kenya",
      email: "gideon@example.com",
      matchPercentage: 88,
      about: "Full-stack leaning frontend engineer with a passion for performance optimization.",
      experienceYears: 3,
      availability: "Immediate",
      languages: ["English", "Swahili"],
      skills: ["React", "Next.js", "TypeScript", "GraphQL"],
      experience: [
        { title: "Frontend Engineer", company: "M-KOPA", period: "2021 - Present" },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Thaudo Ngobela",
      role: "Mobile Developer",
      stage: "New",
      appliedAt: new Date(now - 2 * 86400_000).toISOString(),
      location: "Cape Town, South Africa",
      email: "thaudo@example.com",
      matchPercentage: 65,
      about: "Mobile developer specializing in cross-platform apps with React Native.",
      experienceYears: 1.5,
      availability: "1 month notice",
      languages: ["English", "Afrikaans"],
      skills: ["React Native", "JavaScript", "Firebase"],
      experience: [
        { title: "Mobile Developer", company: "Startup (Contract)", period: "2023 - Present" },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Amina Yusuf",
      role: "Backend Engineer",
      stage: "Interview",
      appliedAt: new Date(now - 3 * 86400_000).toISOString(),
      location: "Nairobi, Kenya",
      email: "amina@example.com",
      matchPercentage: 79,
      about: "Backend engineer focused on scalable API design and cloud infrastructure.",
      experienceYears: 5,
      availability: "Immediate",
      languages: ["English", "Swahili"],
      skills: ["Node.js", "PostgreSQL", "AWS", "Docker"],
      experience: [
        { title: "Backend Engineer", company: "Paystash", period: "2020 - Present" },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Jason Friday",
      role: "Virtual Manager",
      stage: "Hired",
      appliedAt: new Date(now - 3 * 86400_000).toISOString(),
      location: "Lagos, Nigeria",
      email: "jason@example.com",
      matchPercentage: 91,
      about: "Operations-minded virtual team manager with experience scaling remote teams.",
      experienceYears: 6,
      availability: "Immediate",
      languages: ["English"],
      skills: ["Team Leadership", "Notion", "Slack", "Project Management"],
      experience: [
        { title: "Remote Operations Manager", company: "Various", period: "2019 - Present" },
      ],
    },
  ];
}

export const employerCandidatesApi = {
  getAll(email: string): EmployerCandidate[] {
    const existing = readCandidates(email);
    if (existing.length > 0) return existing;
    const seeded = seedCandidates();
    writeCandidates(email, seeded);
    return seeded;
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