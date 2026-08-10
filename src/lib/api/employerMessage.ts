export interface EmployerMessage {
  id: string;
  sender: "me" | "candidate";
  text: string;
  sentAt: string;
  attachmentName?: string;
  attachmentUrl?: string; // base64
}

export interface EmployerConversation {
  candidateId: string;
  messages: EmployerMessage[];
}

const PREFIX = "ivp_employer_messages_";

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

function readConversations(email: string): EmployerConversation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(email)) ?? "[]");
  } catch {
    return [];
  }
}

function writeConversations(email: string, conversations: EmployerConversation[]) {
  localStorage.setItem(keyFor(email), JSON.stringify(conversations));
}

// Seeded once so the reference conversation (Chinedu Okafor) has real content to show.
function seedFor(candidateId: string): EmployerMessage[] {
  const now = Date.now();
  return [
    { id: crypto.randomUUID(), sender: "candidate", text: "Hello TechNova team! I received the coding test. I wanted to ask how much time is allocated for submission?", sentAt: new Date(now - 15 * 60_000).toISOString() },
    { id: crypto.randomUUID(), sender: "me", text: "Hi Chinedu! The challenge is designed to take about 3 hours, but we leave the deadline open for 4 days so you can work on it comfortably.", sentAt: new Date(now - 12 * 60_000).toISOString() },
    { id: crypto.randomUUID(), sender: "candidate", text: "Perfect! I will submit it by tomorrow evening. Thanks for the quick response!", sentAt: new Date(now - 10 * 60_000).toISOString() },
  ];
}

export const employerMessagesApi = {
  getAll(email: string): EmployerConversation[] {
    return readConversations(email);
  },

  getForCandidate(email: string, candidateId: string, seedIfFirst = false): EmployerConversation {
    const conversations = readConversations(email);
    const existing = conversations.find((c) => c.candidateId === candidateId);
    if (existing) return existing;

    const fresh: EmployerConversation = {
      candidateId,
      messages: seedIfFirst ? seedFor(candidateId) : [],
    };
    writeConversations(email, [...conversations, fresh]);
    return fresh;
  },

  sendMessage(
    email: string,
    candidateId: string,
    text: string,
    attachment?: { name: string; dataUrl: string }
  ) {
    const conversations = readConversations(email);
    const message: EmployerMessage = {
      id: crypto.randomUUID(),
      sender: "me",
      text,
      sentAt: new Date().toISOString(),
      attachmentName: attachment?.name,
      attachmentUrl: attachment?.dataUrl,
    };

    const existing = conversations.find((c) => c.candidateId === candidateId);
    if (existing) {
      existing.messages.push(message);
      writeConversations(email, conversations);
    } else {
      writeConversations(email, [...conversations, { candidateId, messages: [message] }]);
    }
  },
};