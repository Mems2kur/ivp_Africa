"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Paperclip, Send, Phone, Video, FileText, X } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { employerCandidatesApi,  EmployerCandidate } from "@/lib/api/candidate";
import { employerMessagesApi, EmployerConversation } from "@/lib/api/employerMessage";

const avatarPalette = [
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
];

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase()).slice(0, 2).join("");
}

function formatTimeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function EmployerMessagesPage() {
  const { session } = useSession();
  const [candidates, setCandidates] = useState<EmployerCandidate[]>([]);
  const [conversations, setConversations] = useState<EmployerConversation[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function refresh() {
    if (!session?.email) return;
    const allCandidates = employerCandidatesApi.getAll(session.email);
    setCandidates(allCandidates);
    setConversations(employerMessagesApi.getAll(session.email));
  }

  useEffect(() => {
    refresh();
  }, [session?.email]);

  // auto-select the first candidate, seeding a demo conversation for the first one only
  useEffect(() => {
    if (candidates.length === 0 || selectedCandidateId || !session?.email) return;
    const first = candidates[0];
    employerMessagesApi.getForCandidate(session.email, first.id, true);
    setSelectedCandidateId(first.id);
    refresh();
  }, [candidates, session?.email]);

  const filteredCandidates = useMemo(() => {
    if (search.trim() === "") return candidates;
    return candidates.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [candidates, search]);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);
  const activeConversation = conversations.find((c) => c.candidateId === selectedCandidateId);

  function getPreview(candidateId: string) {
    const conv = conversations.find((c) => c.candidateId === candidateId);
    if (!conv || conv.messages.length === 0) return null;
    return conv.messages[conv.messages.length - 1];
  }

  function handleSelectCandidate(candidateId: string) {
    if (!session?.email) return;
    employerMessagesApi.getForCandidate(session.email, candidateId);
    setSelectedCandidateId(candidateId);
    refresh();
  }

  function handleSend() {
    if (!draft.trim() || !session?.email || !selectedCandidateId) return;
    employerMessagesApi.sendMessage(session.email, selectedCandidateId, draft.trim());
    setDraft("");
    refresh();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file || !session?.email || !selectedCandidateId) return;

    if (file.size > 1.5 * 1024 * 1024) {
      setFileError("Please attach a file under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      employerMessagesApi.sendMessage(
        session.email,
        selectedCandidateId,
        `Sent an attachment: ${file.name}`,
        { name: file.name, dataUrl: reader.result as string }
      );
      refresh();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length]);

  if (candidates.length === 0) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center rounded-2xl border border-gray-100 bg-white">
        <p className="text-sm text-gray-400">No candidates to message yet.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">Candidate Messaging</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Real-time messaging with your talent pipeline.</p>
      </div>

      <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {/* Candidate list */}
        <div className="hidden w-72 shrink-0 flex-col border-r border-gray-100 sm:flex">
          <div className="border-b border-gray-100 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <Search size={15} className="shrink-0 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates..."
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredCandidates.map((candidate, i) => {
              const palette = avatarPalette[i % avatarPalette.length];
              const preview = getPreview(candidate.id);
              const isSelected = candidate.id === selectedCandidateId;

              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => handleSelectCandidate(candidate.id)}
                  className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors ${
                    isSelected ? "bg-[#EDE7F8]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${palette.bg} ${palette.text}`}>
                    {getInitials(candidate.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">{candidate.name}</p>
                      {preview && (
                        <span className="shrink-0 text-[10px] text-gray-400">{formatTimeAgo(preview.sentAt)}</span>
                      )}
                    </div>
                    <p className="truncate text-xs font-medium text-[#8A38F5]">{candidate.role}</p>
                    <p className="truncate text-xs text-gray-400">
                      {preview ? preview.text : "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredCandidates.length === 0 && (
              <p className="p-4 text-center text-sm text-gray-400">No candidates match &quot;{search}&quot;.</p>
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex flex-1 flex-col">
          {selectedCandidate ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                    {getInitials(selectedCandidate.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{selectedCandidate.name}</p>
                    <p className="text-xs text-gray-400">
                      Active candidate for{" "}
                      <span className="font-medium text-[#8A38F5]">{selectedCandidate.role}</span>
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  
                   <a href={`https://wa.me/?text=${encodeURIComponent(`Hi ${selectedCandidate.name}, `)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Call via WhatsApp"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Phone size={16} />
                  </a>
                  
                   <a href={`https://wa.me/?text=${encodeURIComponent(`Hi ${selectedCandidate.name}, let's set up a video call.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Video call via WhatsApp"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Video size={16} />
                  </a>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 sm:px-6">
                {!activeConversation || activeConversation.messages.length === 0 ? (
                  <p className="mt-8 text-center text-sm text-gray-400">
                    No messages yet — say hello to {selectedCandidate.name.split(" ")[0]}.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {activeConversation.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm sm:max-w-md ${
                            msg.sender === "me" ? "bg-[#8A38F5] text-white" : "bg-white text-gray-800"
                          }`}
                        >
                          {msg.attachmentUrl ? (
                            
                             <a href={msg.attachmentUrl}
                              download={msg.attachmentName}
                              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                                msg.sender === "me" ? "bg-white/10" : "bg-gray-50"
                              }`}
                            >
                              <FileText size={16} className={msg.sender === "me" ? "text-white" : "text-[#8A38F5]"} />
                              <span className="truncate text-xs underline">{msg.attachmentName}</span>
                            </a>
                          ) : (
                            <p>{msg.text}</p>
                          )}
                          <p className={`mt-1 text-[10px] ${msg.sender === "me" ? "text-white/70" : "text-gray-400"}`}>
                            {formatTime(msg.sentAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-3 py-3 sm:px-6 sm:py-4">
                {fileError && <p className="mb-2 text-xs text-red-500">{fileError}</p>}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach file"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Paperclip size={17} />
                  </button>
                  <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />

                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={`Type a message to ${selectedCandidate.name.split(" ")[0]}...`}
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#8A38F5]"
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#8A38F5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={15} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-gray-400">Select a candidate to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}