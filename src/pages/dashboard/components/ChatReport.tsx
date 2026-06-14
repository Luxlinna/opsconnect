import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";

const PAGE_SIZE = 20;

const CHANNELS = [
  { id: "whatsapp",  label: "WhatsApp",  icon: "ri-whatsapp-line",  color: "#25D366" },
  { id: "telegram",  label: "Telegram",  icon: "ri-telegram-line",  color: "#26A5E4" },
  { id: "messenger", label: "Messenger", icon: "ri-messenger-line", color: "#0084FF" },
  { id: "instagram", label: "Instagram", icon: "ri-instagram-line", color: "#E4405F" },
  { id: "line",      label: "LINE",      icon: "ri-line-line",      color: "#00C300" },
  { id: "wechat",    label: "WeChat",    icon: "ri-wechat-line",    color: "#07C160" },
];

const DIRECTIONS = [
  { id: "all", label: "All" },
  { id: "inbound", label: "Inbound" },
  { id: "outbound", label: "Outbound" },
];

const STATUSES = ["all", "received", "sent", "delivered", "read", "failed"] as const;

type ViewMode = "messages" | "clients" | "timeline" | "setup";
type Granularity = "daily" | "monthly" | "yearly";

interface Message {
  id: string;
  channel: string;
  direction: "inbound" | "outbound";
  sender_id: string;
  sender_name?: string | null;
  content?: string | null;
  content_type: string;
  status: string;
  created_at: string;
}

interface ChannelSummary { channel: string; total: number; inbound: number; outbound: number }
interface ClientSummary { sender_id: string; sender_name: string; channels: string[]; total: number; inbound: number; outbound: number; lastAt: string }
interface PeriodEntry { key: string; label: string; total: number; inbound: number; outbound: number }

// ── helpers ──────────────────────────────────────────────────────────────────

const chMeta = (id: string) => CHANNELS.find((c) => c.id === id);

function fmtShort(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtLong(iso: string) {
  return new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function periodKey(iso: string, g: Granularity) {
  if (g === "daily")   return iso.slice(0, 10);
  if (g === "monthly") return iso.slice(0, 7);
  return iso.slice(0, 4);
}
function periodLabel(key: string, g: Granularity) {
  if (g === "daily")   return new Date(key + "T12:00:00Z").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (g === "monthly") return new Date(key + "-15T12:00:00Z").toLocaleDateString(undefined, { month: "short", year: "numeric" });
  return key;
}
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";
}
function avatarBg(id: string) {
  const p = ["#E4405F","#26A5E4","#25D366","#FF6B35","#0084FF","#07C160","#A033FF","#EA4335"];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return p[Math.abs(h) % p.length];
}
function mediaIcon(type: string) {
  const m: Record<string, string> = { image: "ri-image-line", video: "ri-video-line", audio: "ri-music-line", file: "ri-file-line", sticker: "ri-emotion-line", location: "ri-map-pin-line" };
  return m[type] ?? "ri-attachment-line";
}
function mediaLabel(type: string) {
  const m: Record<string, string> = { image: "Image", video: "Video", audio: "Audio", file: "File", sticker: "Sticker", location: "Location" };
  return m[type] ?? type;
}

const STATUS_CLS: Record<string, string> = {
  received:  "bg-background-200/80 text-foreground-500",
  sent:      "bg-blue-100 text-blue-600",
  delivered: "bg-accent-100 text-accent-600",
  read:      "bg-accent-200 text-accent-700",
  failed:    "bg-red-100 text-red-500",
};

// ── sub-components ────────────────────────────────────────────────────────────

function Spinner() {
  return <div className="flex items-center justify-center py-12"><span className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
}

function EmptyState({ text = "No messages yet" }: { text?: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-background-200/80 mb-4">
        <i className="ri-chat-history-line text-xl text-foreground-400" />
      </div>
      <p className="text-sm font-semibold text-foreground-700">{text}</p>
      <p className="text-xs text-foreground-500 mt-1">Messages from connected channels will appear here.</p>
    </div>
  );
}

function Pager({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button onClick={() => onChange(Math.max(0, page - 1))} disabled={page === 0}
        className="text-xs font-medium px-3 py-1.5 rounded-md bg-background-50 border border-background-200/70 text-foreground-600 hover:bg-background-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
        <i className="ri-arrow-left-s-line" /> Prev
      </button>
      <span className="text-xs text-foreground-500 px-2">{page + 1} / {total}</span>
      <button onClick={() => onChange(Math.min(total - 1, page + 1))} disabled={page >= total - 1}
        className="text-xs font-medium px-3 py-1.5 rounded-md bg-background-50 border border-background-200/70 text-foreground-600 hover:bg-background-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
        Next <i className="ri-arrow-right-s-line" />
      </button>
    </div>
  );
}

function MsgRow({ msg }: { msg: Message }) {
  const meta = chMeta(msg.channel);
  const isIn = msg.direction === "inbound";
  return (
    <div className="flex items-start gap-3 bg-background-50 rounded-lg border border-background-200/70 px-4 py-3 hover:border-background-300 transition-colors">
      <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5" style={{ backgroundColor: (meta?.color ?? "#999") + "20" }}>
        <i className={`${meta?.icon ?? "ri-message-line"} text-sm`} style={{ color: meta?.color ?? "#999" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-foreground-800 truncate">{msg.sender_name || msg.sender_id}</span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isIn ? "bg-primary-100 text-primary-600" : "bg-secondary-100 text-secondary-600"}`}>
            {isIn ? "↓ In" : "↑ Out"}
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_CLS[msg.status] ?? STATUS_CLS.received}`}>{msg.status}</span>
          {msg.content_type !== "text" && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-background-200/80 text-foreground-500">
              <i className={`${mediaIcon(msg.content_type)} mr-0.5`} />{mediaLabel(msg.content_type)}
            </span>
          )}
        </div>
        <p className="text-xs text-foreground-600 mt-0.5 truncate">
          {msg.content || <span className="italic text-foreground-400">[{msg.content_type}]</span>}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-[10px] text-foreground-400 whitespace-nowrap">{fmtShort(msg.created_at)}</p>
        <p className="text-[10px] text-foreground-300 mt-0.5">{meta?.label ?? msg.channel}</p>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

interface Props { partnerId: string | null }

export default function ChatReport({ partnerId }: Props) {
  const [open, setOpen]           = useState(true);
  const [view, setView]           = useState<ViewMode>("clients");

  // messages tab
  const [msgs, setMsgs]           = useState<Message[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(0);
  const [loading, setLoading]     = useState(false);
  const [chFilter, setChFilter]   = useState<string[]>([]);
  const [dirFilter, setDirFilter] = useState("all");
  const [statFilter, setStatFilter] = useState("all");
  const [searchVal, setSearchVal] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [dateFrom, setDateFrom]   = useState("");
  const [dateTo, setDateTo]       = useState("");
  const [summaries, setSummaries] = useState<ChannelSummary[]>([]);

  // clients tab
  const [clients, setClients]     = useState<ClientSummary[]>([]);
  const [cliLoading, setCliLoading] = useState(false);
  const [cliSearch, setCliSearch] = useState("");
  const [selClient, setSelClient] = useState<ClientSummary | null>(null);
  const [thread, setThread]       = useState<Message[]>([]);
  const [threadTotal, setThreadTotal] = useState(0);
  const [threadPage, setThreadPage]   = useState(0);
  const [threadLoading, setThreadLoading] = useState(false);

  // timeline tab
  const [gran, setGran]           = useState<Granularity>("monthly");
  const [periods, setPeriods]     = useState<PeriodEntry[]>([]);
  const [tlLoading, setTlLoading] = useState(false);

  // seed / demo
  const [seeding, setSeeding]     = useState(false);
  const [seedMsg, setSeedMsg]     = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // ── fetchers ────────────────────────────────────────────────────────────────

  const fetchSummaries = useCallback(async () => {
    if (!partnerId) return;
    const { data } = await supabase.from("messages").select("channel,direction").eq("partner_id", partnerId);
    if (!data) return;
    const map: Record<string, ChannelSummary> = {};
    for (const r of data) {
      if (!map[r.channel]) map[r.channel] = { channel: r.channel, total: 0, inbound: 0, outbound: 0 };
      map[r.channel].total++;
      if (r.direction === "inbound") map[r.channel].inbound++; else map[r.channel].outbound++;
    }
    setSummaries(Object.values(map).sort((a, b) => b.total - a.total));
  }, [partnerId]);

  const fetchMsgs = useCallback(async () => {
    if (!partnerId) return;
    setLoading(true);
    let q = supabase.from("messages")
      .select("id,channel,direction,sender_id,sender_name,content,content_type,status,created_at", { count: "exact" })
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    if (chFilter.length)      q = q.in("channel", chFilter);
    if (dirFilter !== "all")  q = q.eq("direction", dirFilter);
    if (statFilter !== "all") q = q.eq("status", statFilter);
    if (searchVal)            q = q.or(`sender_name.ilike.%${searchVal}%,content.ilike.%${searchVal}%,sender_id.ilike.%${searchVal}%`);
    if (dateFrom)             q = q.gte("created_at", dateFrom);
    if (dateTo)               q = q.lte("created_at", dateTo + "T23:59:59");
    const { data, count } = await q;
    setMsgs((data as Message[]) ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [partnerId, page, chFilter, dirFilter, statFilter, searchVal, dateFrom, dateTo]);

  const fetchClients = useCallback(async () => {
    if (!partnerId) return;
    setCliLoading(true);
    const { data } = await supabase.from("messages")
      .select("sender_id,sender_name,channel,direction,created_at")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false });
    if (!data) { setCliLoading(false); return; }
    const map: Record<string, ClientSummary> = {};
    for (const r of data) {
      if (!map[r.sender_id]) map[r.sender_id] = { sender_id: r.sender_id, sender_name: r.sender_name || r.sender_id, channels: [], total: 0, inbound: 0, outbound: 0, lastAt: r.created_at };
      map[r.sender_id].total++;
      if (r.direction === "inbound") map[r.sender_id].inbound++; else map[r.sender_id].outbound++;
      if (!map[r.sender_id].channels.includes(r.channel)) map[r.sender_id].channels.push(r.channel);
      if (r.created_at > map[r.sender_id].lastAt) map[r.sender_id].lastAt = r.created_at;
    }
    setClients(Object.values(map).sort((a, b) => b.total - a.total));
    setCliLoading(false);
  }, [partnerId]);

  const fetchThread = useCallback(async (client: ClientSummary, pg: number) => {
    if (!partnerId) return;
    setThreadLoading(true);
    const { data, count } = await supabase.from("messages")
      .select("id,channel,direction,sender_id,sender_name,content,content_type,status,created_at", { count: "exact" })
      .eq("partner_id", partnerId)
      .eq("sender_id", client.sender_id)
      .order("created_at", { ascending: true })
      .range(pg * PAGE_SIZE, pg * PAGE_SIZE + PAGE_SIZE - 1);
    setThread((data as Message[]) ?? []);
    setThreadTotal(count ?? 0);
    setThreadLoading(false);
  }, [partnerId]);

  const fetchTimeline = useCallback(async () => {
    if (!partnerId) return;
    setTlLoading(true);
    const { data } = await supabase.from("messages")
      .select("created_at,direction")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: true });
    if (!data) { setTlLoading(false); return; }
    const map: Record<string, PeriodEntry> = {};
    for (const r of data) {
      const k = periodKey(r.created_at, gran);
      if (!map[k]) map[k] = { key: k, label: periodLabel(k, gran), total: 0, inbound: 0, outbound: 0 };
      map[k].total++;
      if (r.direction === "inbound") map[k].inbound++; else map[k].outbound++;
    }
    setPeriods(Object.values(map).sort((a, b) => a.key.localeCompare(b.key)));
    setTlLoading(false);
  }, [partnerId, gran]);

  // ── effects ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (open && partnerId) fetchSummaries();
  }, [open, partnerId, fetchSummaries]);

  useEffect(() => {
    if (!open || !partnerId) return;
    if (view === "messages") fetchMsgs();
    if (view === "clients" && !selClient) fetchClients();
    if (view === "timeline") fetchTimeline();
  }, [open, view, partnerId, selClient, fetchMsgs, fetchClients, fetchTimeline]);

  useEffect(() => {
    if (selClient && partnerId) fetchThread(selClient, threadPage);
  }, [selClient, threadPage, partnerId, fetchThread]);

  // ── handlers ─────────────────────────────────────────────────────────────────

  const toggleCh = (id: string) => { setChFilter((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id]); setPage(0); };
  const doSearch = () => { setSearchVal(searchInput); setPage(0); };

  const seedDemoData = async () => {
    if (!partnerId) return;
    setSeeding(true);
    setSeedMsg(null);
    try {
      const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string;
      const res = await fetch(`${supabaseUrl}/functions/v1/seed-demo-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string}`,
        },
        body: JSON.stringify({ partner_id: partnerId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Seed failed");
      setSeedMsg(`${json.inserted} demo messages loaded!`);
      // refresh all data
      fetchSummaries();
      if (view === "messages") fetchMsgs();
      if (view === "clients") fetchClients();
      if (view === "timeline") fetchTimeline();
    } catch (err) {
      setSeedMsg(`Error: ${(err as Error).message}`);
    }
    setSeeding(false);
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const openClient = (c: ClientSummary) => { setSelClient(c); setThreadPage(0); setThread([]); };
  const closeClient = () => { setSelClient(null); setThread([]); setThreadPage(0); };

  const exportCSV = () => {
    if (!msgs.length) return;
    const rows = [
      "id,channel,direction,sender_id,sender_name,content,content_type,status,created_at",
      ...msgs.map((m) => [m.id, m.channel, m.direction, m.sender_id, m.sender_name ?? "", (m.content ?? "").replace(/,/g, ";"), m.content_type, m.status, m.created_at].join(",")),
    ].join("\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([rows], { type: "text/csv;charset=utf-8;" })), download: `chat-report-${new Date().toISOString().slice(0, 10)}.csv` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const totalPages   = Math.ceil(total / PAGE_SIZE);
  const threadPages  = Math.ceil(threadTotal / PAGE_SIZE);
  const maxPeriod    = Math.max(...periods.map((p) => p.total), 1);
  const filteredClis = clients.filter((c) => !cliSearch || c.sender_name.toLowerCase().includes(cliSearch.toLowerCase()) || c.sender_id.toLowerCase().includes(cliSearch.toLowerCase()));

  // ── render ────────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-foreground-950">Chat Report</h2>
        <button onClick={() => setOpen(!open)} className="text-xs font-medium text-foreground-600 hover:text-primary-500 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1">
          <i className="ri-chat-history-line" /> {open ? "Hide Report" : "View Chat Report"}
        </button>
      </div>

      {open && (
        <div className="bg-background-100 rounded-xl border border-background-200/70 p-5 md:p-6 space-y-5 animate-[fadeInUp_0.3s_ease-out]">

          {/* Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1 bg-background-50 border border-background-200/70 rounded-xl p-1 flex-wrap">
              {([
                { id: "messages" as ViewMode, icon: "ri-message-3-line",  label: "All Messages" },
                { id: "clients"  as ViewMode, icon: "ri-user-3-line",     label: "By Client"    },
                { id: "timeline" as ViewMode, icon: "ri-line-chart-line",  label: "By Period"    },
                { id: "setup"    as ViewMode, icon: "ri-plug-line",        label: "Connect"      },
              ]).map((tab) => (
                <button key={tab.id} onClick={() => { setView(tab.id); closeClient(); }}
                  className={`flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-lg transition-all ${view === tab.id ? "bg-primary-500 text-background-50 dark:text-foreground-950 shadow-sm" : "text-foreground-600 hover:bg-background-100"}`}>
                  <i className={tab.icon} />{tab.label}
                </button>
              ))}
            </div>
            {/* Demo data loader */}
            <div className="flex items-center gap-2">
              {seedMsg && (
                <span className={`text-[11px] font-medium ${seedMsg.startsWith("Error") ? "text-red-500" : "text-accent-600"}`}>{seedMsg}</span>
              )}
              <button onClick={seedDemoData} disabled={seeding || !partnerId}
                className="flex items-center gap-1.5 text-xs font-medium bg-background-50 border border-background-200/70 text-foreground-600 hover:text-foreground-900 hover:bg-background-100 transition-colors whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed">
                {seeding ? <span className="w-3 h-3 border-2 border-foreground-400 border-t-transparent rounded-full animate-spin" /> : <i className="ri-test-tube-line" />}
                {seeding ? "Loading…" : "Load Demo Data"}
              </button>
            </div>
          </div>

          {/* Channel summary tiles */}
          {summaries.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {summaries.map((s) => {
                const meta = chMeta(s.channel);
                const active = chFilter.includes(s.channel);
                return (
                  <div key={s.channel} onClick={() => view === "messages" && toggleCh(s.channel)}
                    className={`rounded-lg border p-3 transition-all ${view === "messages" ? "cursor-pointer" : ""} ${active ? "border-primary-400 bg-primary-50/60" : "border-background-200/70 bg-background-50 hover:border-background-300"}`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <i className={`${meta?.icon ?? "ri-message-line"} text-sm`} style={{ color: meta?.color }} />
                      <span className="text-[11px] font-semibold text-foreground-700 truncate">{meta?.label ?? s.channel}</span>
                    </div>
                    <p className="text-base font-bold text-foreground-950">{s.total.toLocaleString()}</p>
                    <p className="text-[10px] text-foreground-400">{s.inbound} in · {s.outbound} out</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── ALL MESSAGES ─────────────────────────────────────── */}
          {view === "messages" && (<>
            <div className="flex flex-col gap-3">
              {/* channel pills */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] font-semibold text-foreground-400 self-center mr-1">Channel:</span>
                {CHANNELS.map((c) => (
                  <button key={c.id} onClick={() => toggleCh(c.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium whitespace-nowrap cursor-pointer px-3 py-1 rounded-full transition-colors ${chFilter.includes(c.id) ? "text-white" : "bg-background-200/70 text-foreground-600 hover:bg-background-300"}`}
                    style={chFilter.includes(c.id) ? { backgroundColor: c.color } : {}}>
                    <i className={`${c.icon} text-[11px]`} />{c.label}
                  </button>
                ))}
                {chFilter.length > 0 && <button onClick={() => { setChFilter([]); setPage(0); }} className="text-xs text-foreground-400 hover:text-foreground-600 px-2 cursor-pointer">Clear</button>}
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                {/* direction */}
                <div className="flex items-center gap-1 bg-background-50 border border-background-200/70 rounded-lg p-0.5">
                  {DIRECTIONS.map((d) => (
                    <button key={d.id} onClick={() => { setDirFilter(d.id); setPage(0); }}
                      className={`text-xs font-medium whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-md transition-colors ${dirFilter === d.id ? "bg-primary-500 text-background-50 dark:text-foreground-950" : "text-foreground-600 hover:bg-background-100"}`}>
                      {d.label}
                    </button>
                  ))}
                </div>
                {/* status */}
                <select value={statFilter} onChange={(e) => { setStatFilter(e.target.value); setPage(0); }}
                  className="appearance-none bg-background-50 border border-background-200/70 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground-700 outline-none cursor-pointer focus:border-primary-400">
                  {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "Any Status" : s[0].toUpperCase() + s.slice(1)}</option>)}
                </select>
                {/* date range */}
                <div className="flex items-center gap-1.5">
                  <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(0); }} className="bg-background-50 border border-background-200/70 rounded-lg px-2.5 py-1.5 text-xs text-foreground-700 outline-none focus:border-primary-400 cursor-pointer" />
                  <span className="text-xs text-foreground-400">–</span>
                  <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(0); }} className="bg-background-50 border border-background-200/70 rounded-lg px-2.5 py-1.5 text-xs text-foreground-700 outline-none focus:border-primary-400 cursor-pointer" />
                  {(dateFrom || dateTo) && <button onClick={() => { setDateFrom(""); setDateTo(""); setPage(0); }} className="text-xs text-foreground-400 hover:text-foreground-600 cursor-pointer"><i className="ri-close-line" /></button>}
                </div>
              </div>

              {/* search + export */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-background-50 border border-background-200/70 rounded-lg px-3 py-1.5">
                  <i className="ri-search-line text-xs text-foreground-400 flex-shrink-0" />
                  <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSearch()}
                    placeholder="Search sender or message content…"
                    className="flex-1 bg-transparent text-xs text-foreground-800 outline-none placeholder:text-foreground-300" />
                  {searchInput && <button onClick={() => { setSearchInput(""); setSearchVal(""); setPage(0); }} className="text-foreground-400 hover:text-foreground-600 cursor-pointer text-xs"><i className="ri-close-line" /></button>}
                </div>
                <button onClick={doSearch} className="text-xs font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-4 py-1.5 rounded-lg">Search</button>
                <button onClick={exportCSV} disabled={!msgs.length} className="text-xs font-medium bg-background-50 border border-background-200/70 text-foreground-600 hover:text-foreground-800 hover:bg-background-100 transition-colors whitespace-nowrap cursor-pointer px-4 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                  <i className="ri-download-line" /> CSV
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-foreground-500">{loading ? "Loading…" : `${total.toLocaleString()} message${total !== 1 ? "s" : ""}`}</p>
              {total > PAGE_SIZE && <p className="text-xs text-foreground-400">Page {page + 1} of {totalPages}</p>}
            </div>

            {loading ? <Spinner /> : msgs.length === 0 ? <EmptyState /> : (
              <div className="space-y-1.5">{msgs.map((m) => <MsgRow key={m.id} msg={m} />)}</div>
            )}
            {totalPages > 1 && <Pager page={page} total={totalPages} onChange={setPage} />}
          </>)}

          {/* ── BY CLIENT ────────────────────────────────────────── */}
          {view === "clients" && (
            selClient ? (
              /* thread view */
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-background-200/50">
                  <button onClick={closeClient} className="flex items-center gap-1.5 text-xs font-medium text-foreground-500 hover:text-foreground-800 transition-colors cursor-pointer flex-shrink-0">
                    <i className="ri-arrow-left-line" /> All Clients
                  </button>
                  <div className="flex items-center gap-2.5 ml-1 min-w-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: avatarBg(selClient.sender_id) }}>
                      {initials(selClient.sender_name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground-900 truncate">{selClient.sender_name}</p>
                      <p className="text-[11px] text-foreground-400">{selClient.total} messages · Last: {fmtShort(selClient.lastAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-auto flex-shrink-0">
                    {selClient.channels.map((cid) => { const m = chMeta(cid); return m ? <div key={cid} className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: m.color + "20" }}><i className={`${m.icon} text-[10px]`} style={{ color: m.color }} /></div> : null; })}
                  </div>
                </div>

                {threadLoading ? <Spinner /> : thread.length === 0 ? <EmptyState /> : (
                  <div className="max-h-[500px] overflow-y-auto pr-1">
                    {thread.map((msg) => {
                      const isOut = msg.direction === "outbound";
                      const meta = chMeta(msg.channel);
                      return (
                        <div key={msg.id} className={`flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-background-50 transition-colors ${isOut ? "flex-row-reverse" : ""}`}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: (meta?.color ?? "#999") + "20" }}>
                            <i className={`${meta?.icon ?? "ri-message-line"} text-[9px]`} style={{ color: meta?.color ?? "#999" }} />
                          </div>
                          <div className={`flex-1 flex items-center gap-2 min-w-0 ${isOut ? "flex-row-reverse" : ""}`}>
                            <span className={`text-xs px-2.5 py-1 rounded-full truncate max-w-[60%] ${isOut ? "bg-primary-500 text-white" : "bg-background-100 border border-background-200/70 text-foreground-800"}`}>
                              {msg.content_type !== "text"
                                ? <span className="flex items-center gap-1 italic opacity-80"><i className={mediaIcon(msg.content_type)} />{mediaLabel(msg.content_type)}</span>
                                : (msg.content || <span className="italic opacity-60">Empty</span>)}
                            </span>
                            <span className="text-[10px] text-foreground-300 whitespace-nowrap flex-shrink-0">{fmtShort(msg.created_at)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {threadPages > 1 && <Pager page={threadPage} total={threadPages} onChange={setThreadPage} />}
              </>
            ) : (
              /* client list */
              <>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-background-50 border border-background-200/70 rounded-lg px-3 py-1.5">
                    <i className="ri-search-line text-xs text-foreground-400 flex-shrink-0" />
                    <input type="text" value={cliSearch} onChange={(e) => setCliSearch(e.target.value)}
                      placeholder="Search by client name or ID…"
                      className="flex-1 bg-transparent text-xs text-foreground-800 outline-none placeholder:text-foreground-300" />
                    {cliSearch && <button onClick={() => setCliSearch("")} className="text-foreground-400 hover:text-foreground-600 cursor-pointer text-xs"><i className="ri-close-line" /></button>}
                  </div>
                </div>
                <p className="text-xs text-foreground-500">{cliLoading ? "Loading…" : `${filteredClis.length.toLocaleString()} client${filteredClis.length !== 1 ? "s" : ""}`}</p>

                {cliLoading ? <Spinner /> : filteredClis.length === 0 ? <EmptyState text="No clients found" /> : (
                  <div className="space-y-2">
                    {filteredClis.map((client) => (
                      <button key={client.sender_id} onClick={() => openClient(client)}
                        className="w-full flex items-center gap-3 bg-background-50 rounded-lg border border-background-200/70 px-4 py-3 hover:border-primary-300 hover:bg-primary-50/30 transition-all cursor-pointer text-left">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: avatarBg(client.sender_id) }}>
                          {initials(client.sender_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground-900 truncate">{client.sender_name}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[11px] text-foreground-500">{client.total} msgs</span>
                            <span className="text-[10px] text-foreground-300">·</span>
                            <span className="text-[11px] text-primary-500">{client.inbound} in</span>
                            <span className="text-[10px] text-foreground-300">/</span>
                            <span className="text-[11px] text-secondary-500">{client.outbound} out</span>
                            <span className="text-[10px] text-foreground-300">·</span>
                            <span className="text-[11px] text-foreground-400">Last {fmtShort(client.lastAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {client.channels.map((cid) => { const m = chMeta(cid); return m ? <div key={cid} className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: m.color + "20" }}><i className={`${m.icon} text-[10px]`} style={{ color: m.color }} /></div> : null; })}
                        </div>
                        <i className="ri-arrow-right-s-line text-sm text-foreground-300 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )
          )}

          {/* ── BY PERIOD ─────────────────────────────────────────── */}
          {view === "timeline" && (<>
            {/* granularity toggle */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-semibold text-foreground-400">Show by:</span>
              <div className="flex gap-1 bg-background-50 border border-background-200/70 rounded-lg p-0.5">
                {(["daily", "monthly", "yearly"] as Granularity[]).map((g) => (
                  <button key={g} onClick={() => setGran(g)}
                    className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-1.5 rounded-md transition-colors ${gran === g ? "bg-primary-500 text-background-50 dark:text-foreground-950" : "text-foreground-600 hover:bg-background-100"}`}>
                    {g[0].toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-foreground-400">{tlLoading ? "" : `${periods.length} period${periods.length !== 1 ? "s" : ""} · ${periods.reduce((s, p) => s + p.total, 0).toLocaleString()} total messages`}</span>
            </div>

            {tlLoading ? <Spinner /> : periods.length === 0 ? <EmptyState /> : (<>
              {/* bar chart */}
              <div className="bg-background-50 rounded-xl border border-background-200/70 p-4">
                <div className="overflow-x-auto">
                  <div className="flex items-end gap-1.5 pb-5" style={{ minWidth: Math.max(periods.length * 36, 200), height: 180 }}>
                    {periods.map((entry) => {
                      const barH = Math.max(3, (entry.total / maxPeriod) * 140);
                      const inH  = entry.total > 0 ? (entry.inbound / entry.total) * barH : 0;
                      const outH = barH - inH;
                      return (
                        <div key={entry.key} className="flex flex-col items-center gap-0.5 group flex-1" style={{ minWidth: 28 }}>
                          <span className="text-[9px] font-medium text-foreground-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{entry.total}</span>
                          <div className="w-5 relative flex flex-col justify-end rounded-t overflow-hidden" style={{ height: 140 }}>
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: inH, backgroundColor: "#6366f1aa" }} title={`Inbound: ${entry.inbound}`} />
                            <div style={{ position: "absolute", bottom: inH, left: 0, right: 0, height: outH, backgroundColor: "#f59e0baa" }} title={`Outbound: ${entry.outbound}`} />
                          </div>
                          <span className="text-[9px] text-foreground-400 text-center leading-tight" style={{ maxWidth: 32, wordBreak: "break-all" }}>{entry.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-4 pt-3 border-t border-background-200/50">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: "#6366f1aa" }} /><span className="text-[11px] text-foreground-500">Inbound</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: "#f59e0baa" }} /><span className="text-[11px] text-foreground-500">Outbound</span></div>
                </div>
              </div>

              {/* table — most recent first */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-background-200/50">
                      <th className="text-left py-2.5 px-3 font-semibold text-foreground-500 text-[11px] uppercase tracking-wider">Period</th>
                      <th className="text-right py-2.5 px-3 font-semibold text-foreground-500 text-[11px] uppercase tracking-wider">Total</th>
                      <th className="text-right py-2.5 px-3 font-semibold text-foreground-500 text-[11px] uppercase tracking-wider">Inbound</th>
                      <th className="text-right py-2.5 px-3 font-semibold text-foreground-500 text-[11px] uppercase tracking-wider">Outbound</th>
                      <th className="py-2.5 px-3 font-semibold text-foreground-500 text-[11px] uppercase tracking-wider">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...periods].reverse().map((entry, i) => (
                      <tr key={entry.key} className={`border-b border-background-200/30 ${i % 2 === 0 ? "bg-background-50/40" : ""}`}>
                        <td className="py-2.5 px-3 font-semibold text-foreground-800">{entry.label}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground-900">{entry.total.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right text-primary-600 font-medium">{entry.inbound.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right text-amber-600 font-medium">{entry.outbound.toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <div className="flex-1 h-2 bg-background-200/60 rounded-full overflow-hidden" style={{ minWidth: 60 }}>
                              <div className="h-full rounded-full" style={{ width: `${(entry.inbound / maxPeriod) * 100}%`, backgroundColor: "#6366f1aa" }} />
                            </div>
                            <div className="flex-1 h-2 bg-background-200/60 rounded-full overflow-hidden" style={{ minWidth: 60 }}>
                              <div className="h-full rounded-full" style={{ width: `${(entry.outbound / maxPeriod) * 100}%`, backgroundColor: "#f59e0baa" }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>)}
          </>)}

          {/* ── CONNECT / SETUP ───────────────────────────────────── */}
          {view === "setup" && (() => {
            const supabaseUrl = (import.meta.env.VITE_PUBLIC_SUPABASE_URL as string) || "https://<project>.supabase.co";
            const webhooks = [
              { ch: "whatsapp",  label: "WhatsApp",  icon: "ri-whatsapp-line",  color: "#25D366", path: "webhook-whatsapp", steps: ["Go to Meta Business → WhatsApp → Configuration", "Set Webhook URL below", "Subscribe to: messages, message_deliveries, message_reads"] },
              { ch: "telegram",  label: "Telegram",  icon: "ri-telegram-line",  color: "#26A5E4", path: "webhook-telegram", steps: ["Open @BotFather → /setwebhook", `URL: …/webhook-telegram?partner_id=${partnerId ?? "<your-partner-id>"}`, "Set X-Telegram-Bot-Api-Secret-Token header = TELEGRAM_SECRET_TOKEN env var"] },
              { ch: "messenger", label: "Messenger", icon: "ri-messenger-line", color: "#0084FF", path: "webhook-messenger", steps: ["Go to Meta for Developers → your App → Messenger → Webhooks", "Set Webhook URL below + Verify Token", "Subscribe to: messages, messaging_deliveries, messaging_reads"] },
              { ch: "instagram", label: "Instagram", icon: "ri-instagram-line", color: "#E4405F", path: "webhook-instagram", steps: ["Go to Meta for Developers → your App → Instagram → Webhooks", "Set Webhook URL below + Verify Token", "Subscribe to: messages, messaging_deliveries"] },
              { ch: "line",      label: "LINE",      icon: "ri-line-line",      color: "#00C300", path: "webhook-line",     steps: ["Go to LINE Developers Console → your channel → Messaging API", `Set Webhook URL: …/webhook-line?partner_id=${partnerId ?? "<your-partner-id>"}`, "Enable Use webhook"] },
              { ch: "wechat",    label: "WeChat",    icon: "ri-wechat-line",    color: "#07C160", path: "webhook-wechat",   steps: ["Go to WeChat Official Account Platform → Basic Config", `Set Server URL: …/webhook-wechat?partner_id=${partnerId ?? "<your-partner-id>"}`, "Enter Token + EncodingAESKey → Submit"] },
            ];
            return (
              <div className="space-y-5">
                {/* Deploy step */}
                <div className="bg-background-50 rounded-xl border border-background-200/70 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-primary-600">1</span></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground-900">Deploy Edge Functions to Supabase</p>
                      <p className="text-xs text-foreground-500 mt-0.5">Run these commands in your project root once to publish the webhook handlers.</p>
                    </div>
                  </div>
                  <div className="bg-foreground-950 rounded-lg p-4 font-mono text-[11px] text-accent-300 leading-relaxed space-y-1 overflow-x-auto">
                    <p className="text-foreground-400 select-none"># deploy all 6 webhook handlers</p>
                    {["webhook-whatsapp","webhook-telegram","webhook-messenger","webhook-instagram","webhook-line","webhook-wechat","seed-demo-messages"].map((fn) => (
                      <p key={fn}>supabase functions deploy {fn}</p>
                    ))}
                  </div>
                </div>

                {/* Webhook URLs per channel */}
                <div className="bg-background-50 rounded-xl border border-background-200/70 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-primary-600">2</span></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground-900">Register webhook URLs with each platform</p>
                      <p className="text-xs text-foreground-500 mt-0.5">Copy the URL for each channel and paste it into that platform's developer console.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {webhooks.map((w) => {
                      const needsPartner = ["telegram","line","wechat"].includes(w.ch);
                      const url = `${supabaseUrl}/functions/v1/${w.path}${needsPartner ? `?partner_id=${partnerId ?? "<your-partner-id>"}` : ""}`;
                      const isCopied = copiedUrl === url;
                      return (
                        <div key={w.ch} className="rounded-lg border border-background-200/70 overflow-hidden">
                          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-background-100">
                            <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: w.color + "20" }}>
                              <i className={`${w.icon} text-[11px]`} style={{ color: w.color }} />
                            </div>
                            <span className="text-xs font-semibold text-foreground-800 flex-1">{w.label}</span>
                            <button onClick={() => copyWebhookUrl(url)}
                              className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${isCopied ? "bg-accent-100 text-accent-600" : "bg-background-50 border border-background-200/70 text-foreground-600 hover:bg-background-200"}`}>
                              {isCopied ? <><i className="ri-check-line mr-0.5" />Copied</> : <><i className="ri-file-copy-line mr-0.5" />Copy URL</>}
                            </button>
                          </div>
                          <div className="px-4 py-2 bg-background-50 border-t border-background-200/50">
                            <code className="text-[10px] font-mono text-foreground-500 break-all">{url}</code>
                          </div>
                          <div className="px-4 py-2.5 border-t border-background-200/50">
                            <ol className="space-y-0.5">
                              {w.steps.map((s, i) => (
                                <li key={i} className="text-[11px] text-foreground-600 flex gap-2">
                                  <span className="text-foreground-300 flex-shrink-0">{i + 1}.</span>{s}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Env vars reminder */}
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-amber-600">3</span></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground-900">Set Edge Function secrets</p>
                      <p className="text-xs text-foreground-500 mt-0.5">In Supabase Dashboard → Edge Functions → Secrets, add the following:</p>
                    </div>
                  </div>
                  <div className="bg-foreground-950 rounded-lg p-4 font-mono text-[11px] text-accent-300 leading-relaxed space-y-0.5 overflow-x-auto">
                    {["WHATSAPP_APP_SECRET=<your-meta-app-secret>","MESSENGER_APP_SECRET=<your-meta-app-secret>","INSTAGRAM_APP_SECRET=<your-meta-app-secret>","LINE_CHANNEL_SECRET=<your-line-channel-secret>","TELEGRAM_SECRET_TOKEN=<any-random-token-you-choose>"].map((s) => <p key={s}>{s}</p>)}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      )}
    </div>
  );
}
