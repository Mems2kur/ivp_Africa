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

function seedInterviews(): Interview[] {
  const now = new Date();
  const future = (days: number, hour: number, minute: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };
  const past = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString();
  };

  return [
    { id: crypto.randomUUID(), candidateName: "Chinedu Okafor", candidateInitials: getInitials("Chinedu Okafor"), role: "Senior Product Designer", date: future(3, 10, 0), type: "Video Call", status: "upcoming", meetingLink: "https://meet.ivpafrica.com/mock-1" },
    { id: crypto.randomUUID(), candidateName: "Genevive Mensah", candidateInitials: getInitials("Genevive Mensah"), role: "Backend Developer", date: future(4, 14, 30), type: "Video Call", status: "upcoming", meetingLink: "https://meet.ivpafrica.com/mock-2" },
    { id: crypto.randomUUID(), candidateName: "Gideon Pryce", candidateInitials: getInitials("Gideon Pryce"), role: "UI Designer", date: future(7, 11, 15), type: "Phone Interview", status: "upcoming" },
    { id: crypto.randomUUID(), candidateName: "Amina Yusuf", candidateInitials: getInitials("Amina Yusuf"), role: "Backend Engineer", date: past(5), type: "Video Call", status: "completed" },
    { id: crypto.randomUUID(), candidateName: "Jason Friday", candidateInitials: getInitials("Jason Friday"), role: "Virtual Manager", date: past(8), type: "Phone Interview", status: "completed" },
    { id: crypto.randomUUID(), candidateName: "Thaudo Ngobela", candidateInitials: getInitials("Thaudo Ngobela"), role: "Mobile Developer", date: past(2), type: "Video Call", status: "cancelled" },
  ];
}

export const interviewsApi = {
  getAll(email: string): Interview[] {
    const existing = readInterviews(email);
    if (existing.length > 0) return existing;
    const seeded = seedInterviews();
    writeInterviews(email, seeded);
    return seeded;
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