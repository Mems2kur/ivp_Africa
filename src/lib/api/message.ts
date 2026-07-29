import type { Conversation, Message } from "@/lib/types/message";

const PREFIX = "ivp_conversations_";
type Listener = () => void;
const listeners = new Set<Listener>();

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

function readAll(email: string): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(email)) ?? "[]");
  } catch {
    return [];
  }
}

function writeAll(email: string, conversations: Conversation[]) {
  localStorage.setItem(keyFor(email), JSON.stringify(conversations));
  listeners.forEach((l) => l());
}

// Shown only the first time a user has no conversations at all — mimics an
// employer having already reached out, since there's no real employer side
// to generate this yet. Once someone sends/receives a real message, this
// mock data is written to their real storage and becomes "real" going forward.
function seedConversations(): Conversation[] {
  return [
    {
      id: crypto.randomUUID(),
      company: "Kaziflow Technologies",
      role: "Frontend Engineer",
      initial: "K",
      messages: [
        {
          id: crypto.randomUUID(),
          sender: "them",
          text: "Hi! Thanks for applying to Frontend Engineer. Are you available for a quick call this week?",
          sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      company: "Nile Logistics Co.",
      role: "Logistics Coordinator",
      initial: "N",
      messages: [],
    },
  ];
}

export const messagesApi = {
  getAll(email: string): Conversation[] {
    const existing = readAll(email);
    if (existing.length > 0) return existing;

    // first-time user: seed mock data once, persist it, then return it
    const seeded = seedConversations();
    writeAll(email, seeded);
    return seeded;
  },

  getConversation(email: string, conversationId: string): Conversation | undefined {
    return this.getAll(email).find((c) => c.id === conversationId);
  },

  // Finds an existing conversation with this company/job, or creates a new
  // one — used by the "Message employer" button on the job detail page.
  getOrCreateForJob(
    email: string,
    job: { id: string; company: string; title: string; initial: string }
  ): Conversation {
    const conversations = readAll(email);
    const existing = conversations.find((c) => c.jobId === job.id);
    if (existing) return existing;

    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      company: job.company,
      role: job.title,
      initial: job.initial,
      jobId: job.id,
      messages: [],
    };

    writeAll(email, [newConversation, ...conversations]);
    return newConversation;
  },

  sendMessage(email: string, conversationId: string, text: string) {
    const conversations = readAll(email);
    const updated = conversations.map((c) => {
      if (c.id !== conversationId) return c;
      const message: Message = {
        id: crypto.randomUUID(),
        sender: "me",
        text,
        sentAt: new Date().toISOString(),
      };
      return { ...c, messages: [...c.messages, message] };
    });
    writeAll(email, updated);
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};