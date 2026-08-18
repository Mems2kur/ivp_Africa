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

export interface RealConversation {
  id: string;
  applicationId?: string;
  otherPartyName: string;
  lastMessage?: string;
  updatedAt?: string;
}

export interface RealMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}