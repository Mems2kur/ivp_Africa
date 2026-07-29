export interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  sentAt: string; // ISO date
}

export interface Conversation {
  id: string;
  company: string;
  role: string;
  initial: string;
  jobId?: string;
  messages: Message[];
}