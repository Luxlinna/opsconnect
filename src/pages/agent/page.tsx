import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, clearSession } from "@/utils/auth";
import { supabase } from "@/utils/supabase/client";

type ChatStatus = "waiting" | "active" | "closed";

type LiveChat = {
  id: string;
  partner_id: string;
  visitor_name: string;
  visitor_contact: string;
  initial_message: string | null;
  status: ChatStatus;
  created_at: string;
};

type Message = {
  id: string;
  chat_id: string;
  role: "visitor" | "agent" | "ai";
  sender_name: string;
  content: string;
  created_at: string;
};

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [agentName, setAgentName]     = useState("");
  const [partnerId, setPartnerId]     = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [chats, setChats]             = useState<LiveChat[]>([]);
  const [activeChat, setActiveChat]   = useState<LiveChat | null>(null);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [reply, setReply]             = useState("");
  const [sending, setSending]         = useState(false);
  const [filter, setFilter]           = useState<"waiting" | "active" | "all">("waiting");
  const [showChat, setShowChat]       = useState(false); // mobile: list vs chat view
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getSession().then((s) => {
      if (!s) { navigate("/login", { replace: true }); return; }
      if (s.role !== "agent") { navigate(s.role === "admin" ? "/admin" : "/dashboard", { replace: true }); return; }
      setAgentName(s.agentName ?? s.email);
      setPartnerId(s.partnerId);
      setPartnerName(s.partnerName);
    });
  }, []);

  const loadChats = useCallback(async (pid: string) => {
    const { data } = await supabase
      .from("live_chats")
      .select("id, partner_id, visitor_name, visitor_contact, initial_message, status, created_at")
      .eq("partner_id", pid)
      .neq("status", "closed")
      .order("created_at", { ascending: false });
    if (data) setChats(data as LiveChat[]);
  }, []);

  useEffect(() => {
    if (!partnerId) return;
    loadChats(partnerId);
    pollRef.current = setInterval(() => loadChats(partnerId), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [partnerId, loadChats]);

  const loadMessages = useCallback(async (chatId: string) => {
    const { data } = await supabase
      .from("live_chat_messages")
      .select("id, chat_id, role, sender_name, content, created_at")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  }, []);

  // Poll for new messages in active chat
  useEffect(() => {
    if (!activeChat) return;
    const interval = setInterval(() => loadMessages(activeChat.id), 3000);
    return () => clearInterval(interval);
  }, [activeChat?.id, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = async (chat: LiveChat) => {
    setActiveChat(chat);
    setReply("");
    setShowChat(true); // mobile: switch to chat view
    await loadMessages(chat.id);
  };

  const goBackToList = () => {
    setShowChat(false);
    setActiveChat(null);
    setMessages([]);
  };

  const claimChat = async (chat: LiveChat) => {
    await supabase.from("live_chats").update({ status: "active" }).eq("id", chat.id);
    setActiveChat((prev) => prev?.id === chat.id ? { ...prev, status: "active" } : prev);
    setChats((prev) => prev.map((c) => c.id === chat.id ? { ...c, status: "active" } : c));
  };

  const closeChat = async (chatId: string) => {
    await supabase.from("live_chats").update({ status: "closed" }).eq("id", chatId);
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChat?.id === chatId) {
      setActiveChat(null);
      setMessages([]);
      setShowChat(false);
    }
  };

  const sendReply = async () => {
    if (!reply.trim() || !activeChat || sending) return;
    setSending(true);
    const content = reply.trim();
    setReply("");
    const { data: row } = await supabase
      .from("live_chat_messages")
      .insert({ chat_id: activeChat.id, role: "agent", sender_name: agentName, content })
      .select("id, chat_id, role, sender_name, content, created_at")
      .single();
    if (row) setMessages((prev) => [...prev, row as Message]);
    if (activeChat.status === "waiting") await claimChat(activeChat);
    setSending(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  const handleSignOut = async () => {
    await clearSession();
    navigate("/login", { replace: true });
  };

  const filteredChats = chats.filter((c) => filter === "all" ? true : c.status === filter);

  const statusDot = (status: ChatStatus) =>
    status === "waiting" ? "bg-yellow-400" : status === "active" ? "bg-green-400" : "bg-foreground-300";

  const statusLabel = (status: ChatStatus) =>
    status === "waiting" ? "Waiting" : status === "active" ? "Active" : "Closed";

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  // ── Chat List Panel ─────────────────────────────────────────────────────────
  const ChatList = (
    <div className={`
      flex flex-col bg-background-100 border-r border-background-200/70
      w-full md:w-72 xl:w-80 md:flex-shrink-0
      ${showChat ? "hidden md:flex" : "flex"}
    `}>
      {/* Filter tabs */}
      <div className="flex border-b border-background-200/70 flex-shrink-0">
        {(["waiting", "active", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors cursor-pointer ${
              filter === f
                ? "text-primary-600 border-b-2 border-primary-500 bg-background-50"
                : "text-foreground-500 hover:text-foreground-700"
            }`}
          >
            {f === "all" ? "All Open" : f}
            {f !== "all" && (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                f === "waiting" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
              }`}>
                {chats.filter((c) => c.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-foreground-400 px-4 py-12">
            <i className="ri-chat-smile-3-line text-4xl"></i>
            <p className="text-sm text-center">No {filter === "all" ? "open" : filter} chats right now</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => openChat(chat)}
              className={`w-full text-left px-4 py-4 border-b border-background-200/50 transition-colors cursor-pointer active:bg-primary-50 ${
                activeChat?.id === chat.id
                  ? "bg-primary-50 border-l-2 border-l-primary-500"
                  : "hover:bg-background-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground-900 truncate pr-2">{chat.visitor_name}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot(chat.status)}`} />
                  <span className="text-[10px] text-foreground-400 whitespace-nowrap">{timeAgo(chat.created_at)}</span>
                </div>
              </div>
              <p className="text-xs text-foreground-500 truncate mb-1.5">{chat.initial_message ?? chat.visitor_contact}</p>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                chat.status === "waiting" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
              }`}>
                {statusLabel(chat.status)}
              </span>
            </button>
          ))
        )}
      </div>

      <div className="p-3 border-t border-background-200/70 flex-shrink-0">
        <button
          onClick={() => partnerId && loadChats(partnerId)}
          className="w-full text-xs text-foreground-500 hover:text-foreground-700 transition-colors cursor-pointer py-2.5 rounded-md border border-background-200/70 flex items-center justify-center gap-1.5"
        >
          <i className="ri-refresh-line"></i> Refresh
        </button>
      </div>
    </div>
  );

  // ── Chat Window Panel ───────────────────────────────────────────────────────
  const ChatWindow = (
    <div className={`
      flex-1 flex flex-col min-w-0 overflow-hidden
      ${!showChat ? "hidden md:flex" : "flex"}
    `}>
      {activeChat ? (
        <>
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-background-200/70 bg-background-100 flex-shrink-0 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Back button — mobile only */}
              <button
                onClick={goBackToList}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-foreground-500 hover:text-foreground-800 hover:bg-background-200/60 transition-colors cursor-pointer flex-shrink-0"
              >
                <i className="ri-arrow-left-line text-lg"></i>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 flex-shrink-0">
                {activeChat.visitor_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground-900 truncate">{activeChat.visitor_name}</p>
                <p className="text-xs text-foreground-400 truncate">{activeChat.visitor_contact}</p>
              </div>
              <span className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full hidden sm:inline ${
                activeChat.status === "waiting" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
              }`}>
                {statusLabel(activeChat.status)}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {activeChat.status === "waiting" && (
                <button
                  onClick={() => claimChat(activeChat)}
                  className="text-xs font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-colors cursor-pointer px-3 py-1.5 rounded-md whitespace-nowrap"
                >
                  Claim
                </button>
              )}
              <button
                onClick={() => closeChat(activeChat.id)}
                className="text-xs font-medium text-foreground-400 hover:text-red-500 transition-colors cursor-pointer p-1.5 rounded-md border border-background-200/70"
                title="Close chat"
              >
                <i className="ri-close-line text-base"></i>
              </button>
            </div>
          </div>

          {/* Messages — min-h-0 is critical for flex scroll to work */}
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-4 py-4 space-y-3">
            {messages.map((msg) => {
              const isAgent = msg.role === "agent";
              const isAi    = msg.role === "ai";
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isAgent ? "justify-end" : "justify-start"}`}>
                  {!isAgent && (
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${
                      isAi ? "bg-accent-500" : "bg-primary-400"
                    }`}>
                      {isAi ? "AI" : msg.sender_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col gap-0.5 ${isAgent ? "items-end" : "items-start"}`}>
                    {!isAgent && (
                      <span className="text-[10px] text-foreground-400 px-1">{msg.sender_name}</span>
                    )}
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                      isAgent
                        ? "bg-primary-500 text-white rounded-br-sm"
                        : isAi
                          ? "bg-accent-100 text-foreground-800 rounded-bl-sm"
                          : "bg-background-200 text-foreground-800 rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-foreground-300 px-1">{timeAgo(msg.created_at)}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply box */}
          <div className="px-4 py-3 border-t border-background-200/70 bg-background-100 flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Reply… (Enter to send)"
                rows={2}
                className="flex-1 min-w-0 bg-background-50 border border-background-200/70 rounded-xl px-3.5 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300 resize-none leading-relaxed"
              />
              <button
                onClick={sendReply}
                disabled={!reply.trim() || sending}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {sending
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <i className="ri-send-plane-fill text-sm"></i>
                }
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Empty state — desktop only (mobile stays on list) */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-foreground-400 px-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
            <i className="ri-customer-service-2-line text-3xl text-primary-400"></i>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground-700">Select a conversation</p>
            <p className="text-sm mt-1 text-foreground-400">Pick a chat from the left panel to start supporting</p>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-foreground-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" />{chats.filter((c) => c.status === "waiting").length} waiting</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" />{chats.filter((c) => c.status === "active").length} active</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-[100dvh] bg-background-50 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-background-200/70 bg-background-100 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-heading text-base md:text-lg font-bold text-foreground-950 flex-shrink-0">
            OPS<span className="text-primary-500">Connect</span>
          </span>
          <span className="text-foreground-300 text-sm hidden sm:inline">|</span>
          <span className="text-xs sm:text-sm text-foreground-500 truncate hidden sm:inline">Agent — {partnerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
            <span className="text-xs text-foreground-600 font-medium truncate max-w-[100px] sm:max-w-none">{agentName}</span>
          </span>
          <button
            onClick={handleSignOut}
            className="text-xs text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer px-2.5 py-1.5 rounded-md border border-background-200/70 flex-shrink-0"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {ChatList}
        {ChatWindow}
      </div>
    </div>
  );
}
