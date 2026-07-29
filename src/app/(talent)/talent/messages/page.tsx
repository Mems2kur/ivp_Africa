"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { messagesApi } from "@/lib/api/message";
import type { Conversation } from "@/lib/types/message";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function MessagesContent() {
  const { session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  function refresh() {
    if (!session?.email) return;
    const all = messagesApi.getAll(session.email);
    setConversations(all);
    return all;
  }

  useEffect(() => {
    const all = refresh();
    if (!all || all.length === 0) return;

    const requestedId = searchParams.get("conversation");
    const validRequested = requestedId && all.some((c) => c.id === requestedId);
    setActiveId(validRequested ? requestedId : all[0].id);
  }, [session?.email, searchParams]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  function handleSelectConversation(id: string) {
    setActiveId(id);
    router.replace(`/talent/messages?conversation=${id}`);
  }

  function handleSend() {
    if (!draft.trim() || !session?.email || !activeId) return;
    messagesApi.sendMessage(session.email, activeId, draft.trim());
    setDraft("");
    refresh();
  }

  if (conversations.length === 0 || !activeConversation) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center rounded-2xl border border-gray-100 bg-white">
        <p className="text-sm text-gray-400">No conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white">
      {/* Conversation list */}
      <div className="w-72 shrink-0 overflow-y-auto border-r border-gray-100">
        {conversations.map((conv) => {
          const lastMessage = conv.messages[conv.messages.length - 1];
          return (
            <button
              key={conv.id}
              type="button"
              onClick={() => handleSelectConversation(conv.id)}
              className={`flex w-full items-center gap-3 border-b border-gray-100 px-5 py-4 text-left transition-colors ${
                conv.id === activeId ? "bg-[#EDE7F8]" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                {conv.initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{conv.company}</p>
                <p className="truncate text-xs text-gray-500">
                  {lastMessage ? lastMessage.text : conv.role}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chat panel */}
      <div className="flex flex-1 flex-col">
        <div className="border-b border-gray-100 px-6 py-4">
          <p className="text-base font-bold text-gray-900">{activeConversation.company}</p>
          <p className="text-sm text-[#8A38F5]">Re: {activeConversation.role}</p>
        </div>

        <div className="relative flex-1 overflow-y-auto bg-gray-50">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ivp-chat-doodle" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
                <path
                  d="M14 18 h30 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 h-18 l-8 8 v-8 h-4 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8 z"
                  fill="none" stroke="#8A38F5" strokeWidth="1.5" opacity="0.15"
                />
                <path
                  d="M80 100 l5 5 l10 -10 M87 100 l5 5 l10 -10"
                  fill="none" stroke="#8A38F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.15"
                />
                <circle cx="110" cy="30" r="3" fill="#8A38F5" opacity="0.15" />
                <circle cx="120" cy="30" r="3" fill="#8A38F5" opacity="0.15" />
                <circle cx="130" cy="30" r="3" fill="#8A38F5" opacity="0.15" />
                <path
                  d="M20 90 h20 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-10 l-6 6 v-6 h-4 a6 6 0 0 1 -6 -6 v-10 a6 6 0 0 1 6 -6 z"
                  fill="none" stroke="#8A38F5" strokeWidth="1.5" opacity="0.12"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ivp-chat-doodle)" />
          </svg>

          <div className="relative space-y-3 px-6 py-6">
            {activeConversation.messages.length === 0 ? (
              <p className="text-sm text-gray-400">No messages yet.</p>
            ) : (
              activeConversation.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-md rounded-2xl px-5 py-3.5 text-sm shadow-sm ${
                      msg.sender === "me" ? "bg-[#8A38F5] text-white" : "bg-white text-gray-800"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`mt-1 text-[10px] ${msg.sender === "me" ? "text-white/70" : "text-gray-400"}`}>
                      {formatTime(msg.sentAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Write a message..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#8A38F5]"
          />
          <button
            type="button"
            onClick={handleSend}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8A38F5] text-white transition-colors hover:bg-[#7226e0]"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Loading messages…</div>}>
      <MessagesContent />
    </Suspense>
  );
}