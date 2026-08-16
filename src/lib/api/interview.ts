import { EmployerCandidate } from "./candidate";

export type InterviewStatus = "upcoming" | "completed" | "cancelled";
export type InterviewType = "Video Call" | "Phone Interview" | "In-Person";

export interface Interview {
  id: string;
  candidateName: string;
  candidateInitials: string;
  role: string;
  date: string;
  type: InterviewType;
  status: InterviewStatus;
  meetingLink?: string; // for Video Call
  phoneNumber?: string; // for Phone Interview
}

const PREFIX = "ivp_employer_interviews_";

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

function readInterviews(email: string): Interview[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(email)) ?? "[]");
  } catch {
    return [];
  }
}

function writeInterviews(email: string, interviews: Interview[]) {
  localStorage.setItem(keyFor(email), JSON.stringify(interviews));
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase()).slice(0, 2).join("");
}


export const interviewsApi = {
  getAll(email: string): Interview[] {
  return readInterviews(email);
},

 schedule(
  email: string,
  input: { candidateName: string; role: string; date: string; type: InterviewType; phoneNumber?: string }
): Interview {
  const interviews = readInterviews(email);
  const newInterview: Interview = {
    id: crypto.randomUUID(),
    candidateName: input.candidateName,
    candidateInitials: getInitials(input.candidateName),
    role: input.role,
    date: input.date,
    type: input.type,
    status: "upcoming",
    meetingLink: input.type === "Video Call" ? `https://meet.ivpafrica.com/${crypto.randomUUID().slice(0, 8)}` : undefined,
    phoneNumber: input.type === "Phone Interview" ? (input.phoneNumber || "+234 800 000 0000") : undefined,
  };
  writeInterviews(email, [newInterview, ...interviews]);
  return newInterview;
},

  reschedule(email: string, interviewId: string, newDate: string) {
    const interviews = readInterviews(email);
    const updated = interviews.map((i) => (i.id === interviewId ? { ...i, date: newDate } : i));
    writeInterviews(email, updated);
  },

  setStatus(email: string, interviewId: string, status: InterviewStatus) {
    const interviews = readInterviews(email);
    const updated = interviews.map((i) => (i.id === interviewId ? { ...i, status } : i));
    writeInterviews(email, updated);
  },
};