import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase/client";

interface LiveChatSession {
  id: string;
  partner_id: string;
  visitor_name: string;
  visitor_contact: string;
  initial_message: string | null;
  status: "waiting" | "active" | "closed";
  assigned_agent: string | null;
  created_at: string;
}

interface ChatMessage {
  id: string;
  chat_id: string;
  role: "visitor" | "agent" | "ai";
  sender_name: string | null;
  content: string;
  created_at: string;
}

interface Props {
  partnerId: string | null;
}

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

export default function LiveChat({ partnerId }: Props) {
  const [chats, setChats] = useState<LiveChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<LiveChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [agentName, setAgentName] = useState("Agent");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);

  const waitingCount = chats.filter((c) => c.status === "waiting").length;

  useEffect(() => {
    if (!partnerId) return;
    setLoading(true);

    supabase
      .from("live_chats")
      .select("*")
      .eq("partner_id", partnerId)
      .neq("status", "closed")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setChats(data as LiveChatSession[]);
        setLoading(false);
      });

    const ch = supabase
      .channel(`live_chats_${partnerId}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "live_chats", filter: `partner_id=eq.${partnerId}` },
        (payload) => setChats((prev) => [payload.new as LiveChatSession, ...prev])
      )
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "live_chats", filter: `partner_id=eq.${partnerId}` },
        (payload) => {
          const updated = payload.new as LiveChatSession;
          setChats((prev) =>
            updated.status === "closed"
              ? prev.filter((c) => c.id !== updated.id)
              : prev.map((c) => c.id === updated.id ? updated : c)
          );
          setActiveChat((prev) =>
            prev?.id === updated.id ? (updated.status === "closed" ? null : updated) : prev
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [partnerId]);

  useEffect(() => {
    if (!activeChat) { setMessages([]); return; }

    supabase
      .from("live_chat_messages")
      .select("*")
      .eq("chat_id", activeChat.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => { if (data) setMessages(data as ChatMessage[]); });

    supabase.from("live_chats").update({ status: "active" }).eq("id", activeChat.id)
      .then(({ error }) => { if (error) console.error("[LiveChat] status update failed:", error.message); });

    const ch = supabase
      .channel(`msgs_${activeChat.id}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "live_chat_messages", filter: `chat_id=eq.${activeChat.id}` },
        (payload) => setMessages((prev) => [...prev, payload.new as ChatMessage])
      )
      .subscribe();

    setTimeout(() => replyInputRef.current?.focus(), 150);
    return () => { supabase.removeChannel(ch); };
  }, [activeChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!replyText.trim() || !activeChat || sending) return;
    setSending(true);
    const content = replyText.trim();
    setReplyText("");
    await supabase.from("live_chat_messages").insert({
      chat_id: activeChat.id,
      role: "agent",
      sender_name: agentName || "Agent",
      content,
    });
    setSending(false);
    replyInputRef.current?.focus();
  };

  const closeChat = async (chatId: string) => {
    await supabase.from("live_chats").update({ status: "closed" }).eq("id", chatId);
    setActiveChat(null);
  };

  return (
    <div className="bg-background-100 rounded-xl border border-background-200/70 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-sm font-bold text-foreground-950">Live Chat</h2>
          {waitingCount > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              {waitingCount} waiting
            </span>
          )}
        </div>
        <i className="ri-customer-service-2-line text-sm text-foreground-400"></i>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && chats.length === 0 && (
        <div className="text-center py-8">
          <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-background-200/80 mb-3">
            <i className="ri-customer-service-2-line text-lg text-foreground-400"></i>
          </div>
          <p className="text-xs text-foreground-500">No active sessions</p>
          <p className="text-[11px] text-foreground-400 mt-1">Visitors escalated by AI will appear here</p>
        </div>
      )}

      {/* Session list */}
      {!loading && chats.length > 0 && (
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                const asActive = { ...chat, status: "active" as const };
                setActiveChat(asActive);
                setChats((prev) => prev.map((c) => c.id === chat.id ? asActive : c));
              }}
              className="w-full text-left p-3 rounded-lg border border-background-200/50 bg-background-50 hover:bg-background-100 hover:border-primary-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  chat.status === "waiting" ? "bg-red-400 animate-pulse" : "bg-accent-400"
                }`} />
                <p className="text-xs font-semibold text-foreground-800 flex-1 truncate">{chat.visitor_name}</p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  chat.status === "waiting" ? "bg-red-100 text-red-600" : "bg-accent-100 text-accent-600"
                }`}>{chat.status}</span>
              </div>
              <p className="text-[11px] text-foreground-500 truncate pl-4">{chat.visitor_contact}</p>
              <div className="flex items-center justify-between pl-4 mt-1">
                <p className="text-[10px] text-foreground-400 truncate flex-1">
                  {chat.initial_message || "—"}
                </p>
                <span className="text-[10px] text-foreground-300 flex-shrink-0 ml-2">{timeAgo(chat.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Chat modal */}
      {activeChat && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-0 sm:pb-4">
          <div className="bg-background-50 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl h-[90vh] sm:h-[600px] flex flex-col shadow-2xl border border-background-200/70 animate-[fadeInUp_0.25s_ease-out]">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70 flex-shrink-0">
              <div>
                <p className="text-sm font-semibold text-foreground-900">{activeChat.visitor_name}</p>
                <p className="text-[11px] text-foreground-400">{activeChat.visitor_contact}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  activeChat.status === "waiting" ? "bg-red-100 text-red-600" : "bg-accent-100 text-accent-600"
                }`}>{activeChat.status}</span>
                <button
                  onClick={() => closeChat(activeChat.id)}
                  className="text-xs font-medium text-foreground-400 hover:text-red-500 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-red-50"
                >
                  Close Chat
                </button>
                <button
                  onClick={() => setActiveChat(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-foreground-400 hover:text-foreground-600 hover:bg-background-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 && (
                <p className="text-xs text-foreground-400 text-center mt-4">No messages yet</p>
              )}
              {messages.some((m) => m.role === "ai") && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-purple-100"></div>
                  <span className="text-[10px] text-purple-400 font-medium">AI Conversation History</span>
                  <div className="h-px flex-1 bg-purple-100"></div>
                </div>
              )}
              {messages.map((msg) => {
                const isAgent = msg.role === "agent";
                const isAi = msg.role === "ai";
                return (
                  <div key={msg.id} className={`flex ${isAgent ? "justify-end" : "justify-start"} mb-2`}>
                    <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      isAgent ? "bg-primary-500 text-white rounded-br-sm" :
                      isAi    ? "bg-purple-50 border border-purple-100 text-foreground-600 rounded-bl-sm" :
                                "bg-background-100 text-foreground-800 rounded-bl-sm"
                    }`}>
                      <p className={`text-[10px] font-semibold mb-0.5 ${
                        isAgent ? "text-primary-100" : isAi ? "text-purple-400" : "text-foreground-400"
                      }`}>
                        {isAgent ? (msg.sender_name || "Agent") : isAi ? "AI Assistant" : (msg.sender_name || "Visitor")}
                      </p>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              {messages.some((m) => m.role === "ai") && messages.some((m) => m.role !== "ai") && (
                <div className="flex items-center gap-2 my-3">
                  <div className="h-px flex-1 bg-background-200"></div>
                  <span className="text-[10px] text-foreground-400 font-medium">Live Chat</span>
                  <div className="h-px flex-1 bg-background-200"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply area */}
            <div className="px-4 py-3 border-t border-background-200/70 flex-shrink-0 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Your name"
                  className="w-28 text-[11px] bg-background-100 border border-background-200/70 rounded-md px-2 py-1 outline-none focus:border-primary-400 text-foreground-600"
                />
                <p className="text-[11px] text-foreground-400">replying as</p>
              </div>
              <div className="flex gap-2">
                <input
                  ref={replyInputRef}
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                  placeholder={`Reply as ${agentName || "Agent"}…`}
                  className="flex-1 bg-background-50 border border-background-200/70 rounded-xl px-3 py-2 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300"
                />
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim() || sending}
                  className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl transition-colors ${
                    replyText.trim() && !sending
                      ? "bg-primary-500 text-white hover:bg-primary-600"
                      : "bg-background-200 text-foreground-300 cursor-not-allowed"
                  }`}
                >
                  {sending
                    ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    : "Send"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
