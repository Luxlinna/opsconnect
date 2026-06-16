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
  const [agentName, setAgentName] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [chats, setChats] = useState<LiveChat[]>([]);
  const [activeChat, setActiveChat] = useState<LiveChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<"waiting" | "active" | "all">("waiting");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const openChat = async (chat: LiveChat) => {
    setActiveChat(chat);
    setReply("");
    const { data } = await supabase
      .from("live_chat_messages")
      .select("id, chat_id, role, sender_name, content, created_at")
      .eq("chat_id", chat.id)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  // Poll for new messages in active chat
  useEffect(() => {
    if (!activeChat) return;
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("live_chat_messages")
        .select("id, chat_id, role, sender_name, content, created_at")
        .eq("chat_id", activeChat.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as Message[]);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const claimChat = async (chat: LiveChat) => {
    await supabase.from("live_chats").update({ status: "active" }).eq("id", chat.id);
    setActiveChat((prev) => prev?.id === chat.id ? { ...prev, status: "active" } : prev);
    setChats((prev) => prev.map((c) => c.id === chat.id ? { ...c, status: "active" } : c));
  };

  const closeChat = async (chatId: string) => {
    await supabase.from("live_chats").update({ status: "closed" }).eq("id", chatId);
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChat?.id === chatId) setActiveChat(null);
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

  return (
    <div className="h-screen bg-background-50 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-background-200/70 bg-background-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-heading text-lg font-bold text-foreground-950">
            OPS<span className="text-primary-500">Connect</span>
          </span>
          <span className="text-foreground-300 text-sm">|</span>
          <span className="text-sm text-foreground-600">Agent — {partnerName}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-foreground-600 font-medium">{agentName}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer px-3 py-1.5 rounded-md border border-background-200/70"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — chat list */}
        <div className="w-72 xl:w-80 flex-shrink-0 border-r border-background-200/70 flex flex-col bg-background-100">
          {/* Filter tabs */}
          <div className="flex border-b border-background-200/70">
            {(["waiting", "active", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors cursor-pointer ${filter === f ? "text-primary-600 border-b-2 border-primary-500 bg-background-50" : "text-foreground-500 hover:text-foreground-700"}`}
              >
                {f === "all" ? "All Open" : f}
                {f !== "all" && (
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${f === "waiting" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {chats.filter((c) => c.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-foreground-400 px-4 py-8">
                <i className="ri-chat-smile-3-line text-3xl"></i>
                <p className="text-xs text-center">No {filter === "all" ? "open" : filter} chats right now</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => openChat(chat)}
                  className={`w-full text-left px-4 py-3.5 border-b border-background-200/50 transition-colors cursor-pointer ${activeChat?.id === chat.id ? "bg-primary-50 border-l-2 border-l-primary-500" : "hover:bg-background-50"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground-900 truncate">{chat.visitor_name}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(chat.status)}`} />
                      <span className="text-[10px] text-foreground-400">{timeAgo(chat.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground-500 truncate">{chat.initial_message ?? chat.visitor_contact}</p>
                  <span className={`mt-1 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full ${chat.status === "waiting" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {statusLabel(chat.status)}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="p-3 border-t border-background-200/70">
            <button
              onClick={() => partnerId && loadChats(partnerId)}
              className="w-full text-xs text-foreground-500 hover:text-foreground-700 transition-colors cursor-pointer py-2 rounded-md border border-background-200/70 flex items-center justify-center gap-1.5"
            >
              <i className="ri-refresh-line"></i> Refresh
            </button>
          </div>
        </div>

        {/* Main — chat window */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-background-200/70 bg-background-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                    {activeChat.visitor_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground-900">{activeChat.visitor_name}</p>
                    <p className="text-xs text-foreground-400">{activeChat.visitor_contact}</p>
                  </div>
                  <span className={`ml-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${activeChat.status === "waiting" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {statusLabel(activeChat.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {activeChat.status === "waiting" && (
                    <button
                      onClick={() => claimChat(activeChat)}
                      className="text-xs font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-colors cursor-pointer px-3 py-1.5 rounded-md"
                    >
                      Claim Chat
                    </button>
                  )}
                  <button
                    onClick={() => closeChat(activeChat.id)}
                    className="text-xs font-medium text-foreground-400 hover:text-red-500 transition-colors cursor-pointer px-3 py-1.5 rounded-md border border-background-200/70"
                  >
                    <i className="ri-close-circle-line"></i> Close
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.map((msg) => {
                  const isAgent = msg.role === "agent";
                  const isAi = msg.role === "ai";
                  return (
                    <div key={msg.id} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                      {!isAgent && (
                        <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mr-2 mt-0.5 ${isAi ? "bg-accent-500" : "bg-primary-400"}`}>
                          {isAi ? "AI" : msg.sender_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className={`max-w-[70%] ${isAgent ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                        {!isAgent && (
                          <span className="text-[10px] text-foreground-400 ml-0.5">{msg.sender_name}</span>
                        )}
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isAgent ? "bg-primary-500 text-white rounded-tr-sm" : isAi ? "bg-accent-100 text-foreground-800 rounded-tl-sm" : "bg-background-200 text-foreground-800 rounded-tl-sm"}`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-foreground-300 px-0.5">{timeAgo(msg.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              <div className="px-5 py-4 border-t border-background-200/70 bg-background-100 flex-shrink-0">
                <div className="flex gap-2">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    placeholder="Type your reply… (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    className="flex-1 bg-background-50 border border-background-200/70 rounded-xl px-4 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300 resize-none"
                  />
                  <button
                    onClick={sendReply}
                    disabled={!reply.trim() || sending}
                    className="w-10 h-10 self-end flex items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0"
                  >
                    {sending ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <i className="ri-send-plane-fill text-sm"></i>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-foreground-400">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
                <i className="ri-customer-service-2-line text-3xl text-primary-400"></i>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-foreground-700">Select a conversation</p>
                <p className="text-sm mt-1">Pick a chat from the left panel to start supporting</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-xs">{chats.filter((c) => c.status === "waiting").length} waiting</span>
                <span className="w-2 h-2 rounded-full bg-green-400 ml-3" />
                <span className="text-xs">{chats.filter((c) => c.status === "active").length} active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
