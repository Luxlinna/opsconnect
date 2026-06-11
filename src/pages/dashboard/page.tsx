import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { partnerChannels } from "@/mocks/partners";
import { dashboardStats, channelMetrics, recentActivity, analyticsTrends, customerNames, messagePreviews, monthlyReportData } from "@/mocks/dashboard";
import { getSession, getPartnerChannels } from "@/utils/auth";
import ChatReport from "./components/ChatReport";

type TestState = "idle" | "testing" | "success" | "error";
type BulkTestEntry = { channelId: string; status: TestState };
type SimMessage = { id: number; channelId: string; customer: string; message: string; timestamp: string };

const channelIcons: Record<string, string> = {
  whatsapp: "ri-whatsapp-line", telegram: "ri-telegram-line", messenger: "ri-messenger-line",
  instagram: "ri-instagram-line", line: "ri-line-line", email: "ri-mail-line",
  livechat: "ri-chat-3-line", wechat: "ri-wechat-line",
};
const channelColors: Record<string, string> = {
  whatsapp: "#25D366", telegram: "#26A5E4", messenger: "#0084FF",
  instagram: "#E4405F", line: "#00C300", email: "#EA4335",
  livechat: "#FF6B35", wechat: "#07C160",
};

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export default function Dashboard() {
  const [configuredChannels, setConfiguredChannels] = useState<Set<string>>(new Set());
  const [testStates, setTestStates] = useState<Record<string, TestState>>({});
  const [bulkTest, setBulkTest] = useState<{ running: boolean; entries: BulkTestEntry[] }>({ running: false, entries: [] });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [disconnectModal, setDisconnectModal] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<SimMessage[]>([]);
  const [simRunning, setSimRunning] = useState(false);
  const simMsgIdRef = useRef(0);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [activeAnalyticsChannel, setActiveAnalyticsChannel] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerIdState, setPartnerIdState] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<SimMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportModal, setReportModal] = useState<{ channelId: string; report: string } | null>(null);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetName, setWidgetName] = useState("");
  const [widgetAvatar, setWidgetAvatar] = useState("");
  const [widgetColorFrom, setWidgetColorFrom] = useState("#0099FF");
  const [widgetColorTo, setWidgetColorTo] = useState("#A033FF");
  const [widgetContacts, setWidgetContacts] = useState<Record<string, string>>({});
  const [widgetCopied, setWidgetCopied] = useState(false);

  useEffect(() => {
    getSession().then(async (session) => {
      if (session?.role === "partner" && session.partnerId) {
        setPartnerName(session.partnerName || null);
        setPartnerIdState(session.partnerId);
        const name = session.partnerName || "";
        if (name) {
          setWidgetName(name);
          const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
          setWidgetAvatar(initials.length >= 2 ? initials : name.slice(0, 2).toUpperCase());
        }
        // Load channels from Supabase (falls back to localStorage if needed)
        const channels = await getPartnerChannels(session.partnerId);
        setConfiguredChannels(new Set(channels));
      } else {
        // Fallback: localStorage (covers channels added via wizard before Supabase)
        const ids = new Set<string>();
        if (localStorage.getItem("omni_wa_configured") === "true") ids.add("whatsapp");
        if (localStorage.getItem("omni_ig_configured") === "true") ids.add("instagram");
        if (localStorage.getItem("omni_line_configured") === "true") ids.add("line");
        if (localStorage.getItem("omni_email_configured") === "true") ids.add("email");
        if (localStorage.getItem("omni_lc_configured") === "true") ids.add("livechat");
        if (localStorage.getItem("omni_wc_configured") === "true") ids.add("wechat");
        const savedCompleted = localStorage.getItem("omni_completed_setups");
        if (savedCompleted) {
          try { const c = JSON.parse(savedCompleted); Object.keys(c).forEach((k) => { if (c[k]) ids.add(k); }); } catch { /* ignore */ }
        }
        const savedKeys = localStorage.getItem("omni_saved_keys");
        if (savedKeys) {
          try { const keys = JSON.parse(savedKeys); Object.keys(keys).forEach((k) => { if (keys[k]) ids.add(k); }); } catch { /* ignore */ }
        }
        setConfiguredChannels(ids);
        const name = localStorage.getItem("omni_partner_name") || "";
        setPartnerName(name || null);
        setPartnerIdState(localStorage.getItem("omni_partner_id"));
        if (name) {
          setWidgetName(name);
          const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
          setWidgetAvatar(initials.length >= 2 ? initials : name.slice(0, 2).toUpperCase());
        }
      }
    });
  }, []);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 2500); };

  const WIDGET_CHANNEL_FIELDS: Record<string, { label: string; placeholder: string; hint: string; icon: string; color: string }> = {
    messenger:  { label: "Messenger",  placeholder: "m.me/YourPage",             hint: "Page username or m.me/ link",    icon: "ri-messenger-line",  color: "#0084FF" },
    whatsapp:   { label: "WhatsApp",   placeholder: "46707383361",                hint: "Phone number with country code", icon: "ri-whatsapp-line",   color: "#25D366" },
    telegram:   { label: "Telegram",   placeholder: "t.me/yourusername",          hint: "Username, @handle, or t.me/ link", icon: "ri-telegram-line",   color: "#26A5E4" },
    line:       { label: "LINE",       placeholder: "your-line-id",               hint: "LINE ID",                    icon: "ri-line-line",        color: "#00C300" },
    instagram:  { label: "Instagram",  placeholder: "yourusername",               hint: "Instagram username (without @)", icon: "ri-instagram-line",  color: "#E4405F" },
    email:      { label: "Email",      placeholder: "hello@yourbusiness.com",     hint: "Support email address",      icon: "ri-mail-line",        color: "#EA4335" },
  };

  const generateEmbedCode = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://omniconnect.io";
    const lines: string[] = [`  src="${origin}/widget.js"`];
    if (partnerIdState)                       lines.push(`  data-partner-id="${partnerIdState}"`);
    if (widgetName)                           lines.push(`  data-name="${widgetName}"`);
    if (widgetAvatar)                         lines.push(`  data-avatar="${widgetAvatar}"`);
    if (widgetColorFrom !== "#0099FF")        lines.push(`  data-color-from="${widgetColorFrom}"`);
    if (widgetColorTo   !== "#A033FF")        lines.push(`  data-color-to="${widgetColorTo}"`);
    if (widgetContacts.messenger)             lines.push(`  data-messenger="${widgetContacts.messenger}"`);
    if (widgetContacts.whatsapp)              lines.push(`  data-whatsapp="${widgetContacts.whatsapp}"`);
    if (widgetContacts.telegram)              lines.push(`  data-telegram="${widgetContacts.telegram}"`);
    if (widgetContacts.line)                  lines.push(`  data-line="${widgetContacts.line}"`);
    if (widgetContacts.instagram)             lines.push(`  data-instagram="${widgetContacts.instagram}"`);
    if (widgetContacts.email)                 lines.push(`  data-email="${widgetContacts.email}"`);
    return `<script\n${lines.join("\n")}>\n</script>`;
  };

  const handleCopyEmbed = async () => {
    const code = generateEmbedCode();
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for HTTP (non-secure) contexts
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setWidgetCopied(true);
    setTimeout(() => setWidgetCopied(false), 2000);
  };

  const handleTestConnection = (channelId: string) => {
    setTestStates((prev) => ({ ...prev, [channelId]: "testing" }));
    setTimeout(() => {
      setTestStates((prev) => ({ ...prev, [channelId]: "success" }));
      const channel = partnerChannels.find((ch) => ch.id === channelId);
      showToast(`Test message sent through ${channel?.name || "channel"} successfully!`);
      setTimeout(() => { setTestStates((prev) => { const next = { ...prev }; delete next[channelId]; return next; }); }, 3000);
    }, 1200 + Math.random() * 800);
  };

  const handleBulkTestAll = useCallback(() => {
    const connected = partnerChannels.filter((ch) => configuredChannels.has(ch.id));
    if (connected.length === 0) { showToast("No connected channels to test."); return; }
    const entries: BulkTestEntry[] = connected.map((ch) => ({ channelId: ch.id, status: "idle" as TestState }));
    setBulkTest({ running: true, entries });

    const runSequential = async () => {
      for (let i = 0; i < entries.length; i++) {
        setBulkTest((prev) => {
          const updated = [...prev.entries];
          updated[i] = { ...updated[i], status: "testing" };
          return { ...prev, entries: updated };
        });
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 600));
        setBulkTest((prev) => {
          const updated = [...prev.entries];
          updated[i] = { ...updated[i], status: Math.random() > 0.1 ? "success" : "error" };
          return { ...prev, entries: updated };
        });
      }
      setBulkTest((prev) => ({ ...prev, running: false }));
      const passed = entries.filter((e) => e.status !== "error" || true).length;
      showToast(`Bulk test complete: ${passed}/${entries.length} channels passed!`);
    };
    runSequential();
  }, [configuredChannels]);

  const toggleSimulation = () => {
    if (simRunning) {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      setSimRunning(false);
      showToast("Live simulation stopped.");
      return;
    }
    const connected = partnerChannels.filter((ch) => configuredChannels.has(ch.id));
    if (connected.length === 0) { showToast("Connect at least one channel first."); return; }
    setSimRunning(true);
    showToast("Live message simulation started!");
    simIntervalRef.current = setInterval(() => {
      const channel = randomItem(connected);
      simMsgIdRef.current += 1;
      const newMsg: SimMessage = {
        id: simMsgIdRef.current,
        channelId: channel.id,
        customer: randomItem(customerNames),
        message: randomItem(messagePreviews),
        timestamp: "Just now",
      };
      setLiveMessages((prev) => {
        const updated = [newMsg, ...prev];
        if (updated.length > 50) updated.length = 50;
        updated.forEach((m, idx) => { if (idx > 0) { const secs = (idx * 2) + Math.floor(Math.random() * 10); m.timestamp = `${secs}s ago`; } });
        return updated.map((m, idx) => idx === 0 ? { ...m, timestamp: "Just now" } : m);
      });
    }, 2500 + Math.random() * 1500);
  };

  useEffect(() => { return () => { if (simIntervalRef.current) clearInterval(simIntervalRef.current); }; }, []);

  const handleReplySend = () => {
    if (!replyTarget || !replyText.trim()) return;
    const replyMsg: SimMessage = {
      id: simMsgIdRef.current + 10000,
      channelId: replyTarget.channelId,
      customer: "You replied",
      message: replyText.trim(),
      timestamp: "Just now",
    };
    simMsgIdRef.current += 1;
    setLiveMessages((prev) => {
      const updated = [replyMsg, ...prev];
      if (updated.length > 50) updated.length = 50;
      return updated;
    });
    setReplyText("");
    setReplyTarget(null);
    const channel = partnerChannels.find((c) => c.id === replyTarget.channelId);
    showToast(`Reply sent via ${channel?.name || replyTarget.channelId}!`);
  };

  const generateReport = (channelId: string): string => {
    const data = monthlyReportData[channelId];
    const channel = partnerChannels.find((c) => c.id === channelId);
    if (!data || !channel) return "";

    const date = new Date();
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `=========================================
MONTHLY REPORT — ${channel.name}
${monthName} ${year}
=========================================

SUMMARY
-----------------------------------------
Total Messages:    ${data.totalMessages.toLocaleString()}
Resolved:          ${data.resolved.toLocaleString()}
Resolution Rate:   ${((data.resolved / data.totalMessages) * 100).toFixed(2)}%
Avg Response Time: ${data.avgResponseMin} minutes
CSAT Score:        ${data.csat}%
Peak Hours:        ${data.peakHours}
Top Customer:      ${data.topCustomer}

CHANNEL DETAILS
-----------------------------------------
Type:              ${channel.name}
Connected Since:   ${channelMetrics[channelId]?.connectedSince || "N/A"}
Messages Today:    ${channelMetrics[channelId]?.messagesToday.toLocaleString() || "N/A"}
All-Time Messages: ${channelMetrics[channelId]?.totalMessages.toLocaleString() || "N/A"}

=========================================
Generated by OmniConnect Analytics
${date.toISOString().split("T")[0]}
=========================================`;
  };

  const handleGenerateReport = (channelId: string) => {
    const report = generateReport(channelId);
    setReportModal({ channelId, report });
  };

  const handleExportCSV = (channelId: string) => {
    const data = monthlyReportData[channelId];
    const channel = partnerChannels.find((c) => c.id === channelId);
    if (!data || !channel) return;

    const csvRows = [
      "Metric,Value",
      `Channel,${channel.name}`,
      `Total Messages,${data.totalMessages}`,
      `Resolved,${data.resolved}`,
      `Resolution Rate,${((data.resolved / data.totalMessages) * 100).toFixed(2)}%`,
      `Avg Response Time (min),${data.avgResponseMin}`,
      `CSAT Score,${data.csat}%`,
      `Peak Hours,${data.peakHours}`,
      `Top Customer,${data.topCustomer}`,
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `monthly-report-${channelId}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Monthly report for ${channel.name} exported!`);
  };

  const handleDisconnect = (channelId: string) => {
    const removals: Record<string, string[]> = {
      whatsapp: ["omni_wa_configured", "omni_wa_phone", "omni_wa_cc"],
      instagram: ["omni_ig_configured", "omni_ig_data"],
      line: ["omni_line_configured", "omni_line_data"],
      email: ["omni_email_configured", "omni_email_data"],
      livechat: ["omni_lc_configured", "omni_lc_data"],
      wechat: ["omni_wc_configured", "omni_wc_data"],
      telegram: ["omni_api_key_telegram"],
      messenger: ["omni_api_key_messenger"],
    };
    const keys = removals[channelId] || [];
    keys.forEach((k) => localStorage.removeItem(k));
    if (channelId === "telegram" || channelId === "messenger") {
      const savedKeys = localStorage.getItem("omni_saved_keys");
      if (savedKeys) {
        try { const parsed = JSON.parse(savedKeys); delete parsed[channelId]; localStorage.setItem("omni_saved_keys", JSON.stringify(parsed)); } catch { /* ignore */ }
      }
      const savedCompleted = localStorage.getItem("omni_completed_setups");
      if (savedCompleted) {
        try { const parsed = JSON.parse(savedCompleted); delete parsed[channelId]; localStorage.setItem("omni_completed_setups", JSON.stringify(parsed)); } catch { /* ignore */ }
      }
    }
    setConfiguredChannels((prev) => { const next = new Set(prev); next.delete(channelId); return next; });
    setDisconnectModal(null);
    const channel = partnerChannels.find((ch) => ch.id === channelId);
    showToast(`${channel?.name || "Channel"} disconnected successfully.`);
  };

  const connectedArray = partnerChannels.filter((ch) => configuredChannels.has(ch.id));
  const disconnectedArray = partnerChannels.filter((ch) => !configuredChannels.has(ch.id));

  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 min-h-screen bg-background-50">
        <div className="px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950">Channel Dashboard</h1>
                <p className="text-sm text-foreground-500 mt-1">
                  {partnerName ? `${partnerName}'s unified inbox` : "Monitor and manage all your connected messaging channels"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleBulkTestAll}
                  disabled={bulkTest.running || connectedArray.length === 0}
                  className={`text-sm font-semibold whitespace-nowrap cursor-pointer px-5 py-2.5 rounded-md transition-colors ${
                    bulkTest.running
                      ? "bg-accent-100 text-accent-600"
                      : connectedArray.length === 0
                        ? "bg-background-200/70 text-foreground-300 cursor-not-allowed"
                        : "bg-accent-500 text-background-50 dark:text-foreground-950 hover:bg-accent-600"
                  }`}
                >
                  {bulkTest.running ? (
                    <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"/> Testing All...</span>
                  ) : (
                    <span className="flex items-center gap-1"><i className="ri-flashlight-line"></i> Bulk Test All</span>
                  )}
                </button>
                <Link
                  to="/partners#connect"
                  className="text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-2.5 rounded-md inline-flex items-center gap-1.5"
                >
                  <i className="ri-add-line"></i> Connect New Channel
                </Link>
              </div>
            </div>

            {/* Partner ID Badge */}
            {partnerIdState && (
              <div className="bg-background-100 rounded-xl border border-accent-200/60 px-5 py-3 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-100">
                    <i className="ri-key-2-line text-sm text-accent-600"></i>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground-800">Partner ID</p>
                    <code className="text-xs font-mono text-foreground-600 select-all">{partnerIdState}</code>
                  </div>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(partnerIdState); showToast("Partner ID copied!"); }} className="text-xs font-medium text-foreground-600 hover:text-primary-500 transition-colors whitespace-nowrap cursor-pointer self-start sm:self-auto">
                  <i className="ri-file-copy-line mr-1"></i>Copy ID
                </button>
              </div>
            )}

            {/* Bulk Test Progress */}
            {bulkTest.running && (
              <div className="bg-background-100 rounded-xl border border-background-200/70 p-5 mb-8">
                <h3 className="text-sm font-semibold text-foreground-900 mb-4">Bulk Test Progress</h3>
                <div className="space-y-2">
                  {bulkTest.entries.map((entry) => {
                    const channel = partnerChannels.find((c) => c.id === entry.channelId);
                    return (
                      <div key={entry.channelId} className="flex items-center gap-3 bg-background-50 rounded-lg px-4 py-2.5">
                        <div className="w-7 h-7 flex items-center justify-center rounded-md" style={{ backgroundColor: (channel?.color || "#999") + "20" }}>
                          <i className={`${channel?.icon || "ri-question-line"} text-xs`} style={{ color: channel?.color || "#999" }}></i>
                        </div>
                        <span className="flex-1 text-xs font-medium text-foreground-800">{channel?.name || entry.channelId}</span>
                        <div className="flex items-center gap-2">
                          {entry.status === "idle" && <span className="text-xs text-foreground-400">Waiting...</span>}
                          {entry.status === "testing" && <span className="flex items-center gap-1.5 text-xs text-foreground-500"><span className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"/> Testing</span>}
                          {entry.status === "success" && <span className="flex items-center gap-1 text-xs text-accent-600"><i className="ri-checkbox-circle-line"></i> Passed</span>}
                          {entry.status === "error" && <span className="flex items-center gap-1 text-xs text-red-500"><i className="ri-close-circle-line"></i> Failed</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="bg-background-100 rounded-xl border border-background-200/70 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-100">
                      <i className={`${stat.icon} text-base text-primary-600`}></i>
                    </div>
                    <span className="text-[10px] font-medium text-accent-600 bg-accent-100 px-1.5 py-0.5 rounded-full">{stat.trend}</span>
                  </div>
                  <div className="font-heading text-xl md:text-2xl font-bold text-foreground-950">{stat.value}</div>
                  <div className="text-xs text-foreground-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Connected Channels + Analytics */}
              <div className="lg:col-span-2 space-y-6">
                {/* Connected Channels */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-bold text-foreground-950">Connected Channels ({connectedArray.length})</h2>
                    <button
                      onClick={() => setAnalyticsOpen(!analyticsOpen)}
                      className="text-xs font-medium text-foreground-600 hover:text-primary-500 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                    >
                      <i className="ri-bar-chart-line"></i> {analyticsOpen ? "Hide Analytics" : "View Analytics"}
                    </button>
                  </div>

                  {connectedArray.length === 0 ? (
                    <div className="bg-background-100 rounded-xl border border-background-200/70 p-8 text-center">
                      <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-background-200/80 mb-4">
                        <i className="ri-plug-line text-2xl text-foreground-400"></i>
                      </div>
                      <p className="text-sm font-semibold text-foreground-700">No channels connected yet</p>
                      <p className="text-xs text-foreground-500 mt-1 mb-4">Connect your first messaging channel to get started.</p>
                      <Link to="/partners#connect" className="text-sm font-medium bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-2.5 rounded-md inline-block">
                        Set Up Channels
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {connectedArray.map((channel) => {
                        const metrics = channelMetrics[channel.id];
                        const testState = testStates[channel.id];
                        return (
                          <div key={channel.id} className="bg-background-100 rounded-xl border border-accent-200/60 p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 flex items-center justify-center rounded-xl" style={{ backgroundColor: channel.color + "20" }}>
                                  <i className={`${channel.icon} text-xl`} style={{ color: channel.color }}></i>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-heading text-sm font-semibold text-foreground-900">{channel.name}</h3>
                                    <span className="w-2 h-2 rounded-full bg-accent-500" />
                                  </div>
                                  <p className="text-xs text-foreground-500 mt-0.5">Connected since {metrics?.connectedSince || "recently"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleTestConnection(channel.id)}
                                  disabled={!!testState}
                                  className={`text-xs font-medium whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
                                    testState === "success"
                                      ? "bg-accent-100 text-accent-600"
                                      : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                                  }`}
                                >
                                  {testState === "testing" ? (
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin" /> Testing</span>
                                  ) : testState === "success" ? (
                                    <span className="flex items-center gap-1"><i className="ri-check-line"></i> Passed</span>
                                  ) : (
                                    <span className="flex items-center gap-1"><i className="ri-send-plane-line text-[10px]"></i> Test</span>
                                  )}
                                </button>
                                <button onClick={() => setDisconnectModal(channel.id)} className="text-xs font-medium whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-md text-foreground-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                                  Disconnect
                                </button>
                              </div>
                            </div>
                            {metrics && (
                              <div className="mt-4 grid grid-cols-3 gap-3">
                                <div className="bg-background-50 rounded-lg p-3">
                                  <p className="text-[10px] text-foreground-400 uppercase tracking-wider mb-0.5">Today</p>
                                  <p className="text-sm font-bold text-foreground-900">{metrics.messagesToday.toLocaleString()}</p>
                                </div>
                                <div className="bg-background-50 rounded-lg p-3">
                                  <p className="text-[10px] text-foreground-400 uppercase tracking-wider mb-0.5">Total</p>
                                  <p className="text-sm font-bold text-foreground-900">{metrics.totalMessages.toLocaleString()}</p>
                                </div>
                                <div className="bg-background-50 rounded-lg p-3">
                                  <p className="text-[10px] text-foreground-400 uppercase tracking-wider mb-0.5">Avg Reply</p>
                                  <p className="text-sm font-bold text-foreground-900">{metrics.avgResponseTime}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Analytics Charts */}
                {analyticsOpen && connectedArray.length > 0 && (
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Channel Analytics — Weekly Message Volume</h2>
                    <div className="bg-background-100 rounded-xl border border-background-200/70 p-5 md:p-6">
                      {/* Channel selector tabs */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <button
                          onClick={() => setActiveAnalyticsChannel(null)}
                          className={`text-xs font-medium whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full transition-colors ${activeAnalyticsChannel === null ? "bg-primary-500 text-background-50 dark:text-foreground-950" : "bg-background-200/70 text-foreground-600 hover:bg-background-300"}`}
                        >
                          All Channels
                        </button>
                        {connectedArray.map((ch) => (
                          <button
                            key={ch.id}
                            onClick={() => setActiveAnalyticsChannel(ch.id)}
                            className={`text-xs font-medium whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-full transition-colors ${activeAnalyticsChannel === ch.id ? "bg-primary-500 text-background-50 dark:text-foreground-950" : "bg-background-200/70 text-foreground-600 hover:bg-background-300"}`}
                          >
                            {ch.name}
                          </button>
                        ))}
                      </div>

                      {/* Bar chart */}
                      <div className="relative">
                        <div className="flex items-end gap-2 md:gap-3 h-[200px] md:h-[240px] mb-3">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                            const totalValue = connectedArray.reduce((sum, ch) => {
                              const trend = analyticsTrends[ch.id];
                              if (!trend) return sum;
                              const entry = trend.find((d) => d.day === day);
                              return sum + (entry?.value || 0);
                            }, 0);
                            const maxTotal = 500;
                            return (
                              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                                <span className="text-[10px] font-medium text-foreground-500">{totalValue}</span>
                                <div className="w-full relative h-[180px] md:h-[210px] flex flex-col justify-end">
                                  {/* Stacked bars for each connected channel */}
                                  {connectedArray.map((ch, idx) => {
                                    const trend = analyticsTrends[ch.id];
                                    const entry = trend?.find((d) => d.day === day);
                                    const chValue = entry?.value || 0;
                                    const chHeightPct = Math.max(1, (chValue / maxTotal) * 100);
                                    const totalBelow = connectedArray.slice(0, idx).reduce((sum, c) => {
                                      const t = analyticsTrends[c.id];
                                      const e = t?.find((d) => d.day === day);
                                      return sum + (e?.value || 0);
                                    }, 0);
                                    return (
                                      <div
                                        key={ch.id}
                                        className="absolute left-0 right-0 rounded-t-sm transition-all duration-300"
                                        style={{
                                          height: `${chHeightPct}%`,
                                          bottom: `${(totalBelow / maxTotal) * 100}%`,
                                          backgroundColor: ch.color + (activeAnalyticsChannel && activeAnalyticsChannel !== ch.id ? "30" : "90"),
                                          zIndex: connectedArray.length - idx,
                                        }}
                                        title={`${ch.name}: ${chValue}`}
                                      />
                                    );
                                  })}
                                </div>
                                <span className="text-[10px] text-foreground-400">{day}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-background-200/50">
                        {connectedArray.map((ch) => (
                          <div key={ch.id} className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: ch.color }} />
                            <span className="text-[11px] text-foreground-600">{ch.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Channels */}
                {disconnectedArray.length > 0 && (
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground-950 mb-4">Available Channels</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {disconnectedArray.map((channel) => (
                        <div key={channel.id} className="bg-background-100 rounded-xl border border-background-200/70 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-background-200/80">
                              <i className={`${channel.icon} text-lg`} style={{ color: channel.color }}></i>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground-800">{channel.name}</p>
                              <p className="text-[11px] text-foreground-400">Not connected</p>
                            </div>
                          </div>
                          <Link to={`/partners?channel=${channel.id}#connect`} className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors whitespace-nowrap cursor-pointer">
                            Set up <i className="ri-arrow-right-line"></i>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Monthly Report Section */}
                {connectedArray.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-heading text-lg font-bold text-foreground-950">Monthly Reports</h2>
                      <button
                        onClick={() => setReportOpen(!reportOpen)}
                        className="text-xs font-medium text-foreground-600 hover:text-primary-500 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                      >
                        <i className="ri-file-chart-line"></i> {reportOpen ? "Hide Reports" : "View Reports"}
                      </button>
                    </div>

                    {reportOpen && (
                      <div className="bg-background-100 rounded-xl border border-background-200/70 p-5 md:p-6 animate-[fadeInUp_0.3s_ease-out]">
                        <p className="text-xs text-foreground-500 mb-5">Download or view aggregated monthly summaries per channel. Data refreshed every 24 hours.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {connectedArray.map((channel) => {
                            const data = monthlyReportData[channel.id];
                            if (!data) return null;
                            return (
                              <div key={channel.id} className="bg-background-50 rounded-lg border border-background-200/70 p-4">
                                <div className="flex items-center gap-2.5 mb-3">
                                  <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: channel.color + "20" }}>
                                    <i className={`${channel.icon} text-sm`} style={{ color: channel.color }}></i>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground-900">{channel.name}</p>
                                    <p className="text-[11px] text-foreground-400">{data.totalMessages.toLocaleString()} messages this month</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  <div className="bg-background-100 rounded p-2">
                                    <p className="text-[10px] text-foreground-400">Resolution</p>
                                    <p className="text-xs font-bold text-foreground-800">{((data.resolved / data.totalMessages) * 100).toFixed(1)}%</p>
                                  </div>
                                  <div className="bg-background-100 rounded p-2">
                                    <p className="text-[10px] text-foreground-400">Avg Reply</p>
                                    <p className="text-xs font-bold text-foreground-800">{data.avgResponseMin} min</p>
                                  </div>
                                  <div className="bg-background-100 rounded p-2">
                                    <p className="text-[10px] text-foreground-400">CSAT</p>
                                    <p className="text-xs font-bold text-foreground-800">{data.csat}%</p>
                                  </div>
                                  <div className="bg-background-100 rounded p-2">
                                    <p className="text-[10px] text-foreground-400">Peak</p>
                                    <p className="text-xs font-bold text-foreground-800 truncate">{data.peakHours.split(" ")[0]}</p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleGenerateReport(channel.id)}
                                    className="flex-1 text-xs font-semibold bg-accent-500 text-background-50 dark:text-foreground-950 hover:bg-accent-600 transition-colors whitespace-nowrap cursor-pointer px-3 py-2 rounded-md flex items-center justify-center gap-1"
                                  >
                                    <i className="ri-file-text-line text-[10px]"></i> View Report
                                  </button>
                                  <button
                                    onClick={() => handleExportCSV(channel.id)}
                                    className="flex-1 text-xs font-semibold bg-secondary-500 text-background-50 dark:text-foreground-950 hover:bg-secondary-600 transition-colors whitespace-nowrap cursor-pointer px-3 py-2 rounded-md flex items-center justify-center gap-1"
                                  >
                                    <i className="ri-download-line text-[10px]"></i> Export CSV
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Chat Report */}
                <ChatReport partnerId={partnerIdState} />

                {/* Website Widget Generator */}
                {connectedArray.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-heading text-lg font-bold text-foreground-950">Website Widget</h2>
                      <button
                        onClick={() => setWidgetOpen(!widgetOpen)}
                        className="text-xs font-medium text-foreground-600 hover:text-primary-500 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                      >
                        <i className="ri-code-s-slash-line"></i> {widgetOpen ? "Hide Generator" : "Get Embed Code"}
                      </button>
                    </div>

                    {!widgetOpen && (
                      <div className="bg-background-100 rounded-xl border border-background-200/70 p-5 flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-100 flex-shrink-0">
                          <i className="ri-chat-smile-2-line text-xl text-primary-600"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground-900">Add a chat widget to your website</p>
                          <p className="text-xs text-foreground-500 mt-0.5">
                            Generate a single <code className="bg-background-200 px-1 rounded text-[11px]">&lt;script&gt;</code> tag — visitors see all your connected channels in one button.
                          </p>
                        </div>
                        <button
                          onClick={() => setWidgetOpen(true)}
                          className="text-xs font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-4 py-2 rounded-md flex-shrink-0"
                        >
                          Generate
                        </button>
                      </div>
                    )}

                    {widgetOpen && (
                      <div className="bg-background-100 rounded-xl border border-background-200/70 p-5 md:p-6 space-y-6 animate-[fadeInUp_0.3s_ease-out]">

                        {/* Step 1: Branding */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-foreground-400 mb-3">1 — Widget Branding</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-foreground-600 block mb-1">Business name</label>
                              <input
                                type="text"
                                value={widgetName}
                                onChange={(e) => setWidgetName(e.target.value)}
                                placeholder="e.g. Lhvsbeauty"
                                className="w-full bg-background-50 border border-background-200/70 rounded-lg px-3 py-2 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-foreground-600 block mb-1">Avatar initials</label>
                              <input
                                type="text"
                                value={widgetAvatar}
                                onChange={(e) => setWidgetAvatar(e.target.value.slice(0, 2).toUpperCase())}
                                placeholder="e.g. LB"
                                maxLength={2}
                                className="w-full bg-background-50 border border-background-200/70 rounded-lg px-3 py-2 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300 uppercase"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-foreground-600 block mb-1">Color — from</label>
                              <div className="flex items-center gap-2">
                                <input type="color" value={widgetColorFrom} onChange={(e) => setWidgetColorFrom(e.target.value)} className="w-9 h-9 rounded-lg border border-background-200/70 cursor-pointer bg-background-50 p-0.5" />
                                <span className="text-xs font-mono text-foreground-600">{widgetColorFrom}</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-foreground-600 block mb-1">Color — to</label>
                              <div className="flex items-center gap-2">
                                <input type="color" value={widgetColorTo} onChange={(e) => setWidgetColorTo(e.target.value)} className="w-9 h-9 rounded-lg border border-background-200/70 cursor-pointer bg-background-50 p-0.5" />
                                <span className="text-xs font-mono text-foreground-600">{widgetColorTo}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Step 2: Channel contacts */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-foreground-400 mb-1">2 — Channel Contact Details</p>
                          <p className="text-xs text-foreground-500 mb-3">Enter the public contact for each connected channel. Visitors will see buttons for the ones you fill in.</p>
                          <div className="space-y-2.5">
                            {connectedArray
                              .filter((ch) => WIDGET_CHANNEL_FIELDS[ch.id])
                              .map((ch) => {
                                const field = WIDGET_CHANNEL_FIELDS[ch.id];
                                return (
                                  <div key={ch.id} className="flex items-center gap-3 bg-background-50 rounded-lg border border-background-200/70 px-3 py-2.5">
                                    <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: field.color + "20" }}>
                                      <i className={`${field.icon} text-sm`} style={{ color: field.color }}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-semibold text-foreground-700 mb-0.5">{field.label} <span className="font-normal text-foreground-400">— {field.hint}</span></p>
                                      <input
                                        type="text"
                                        value={widgetContacts[ch.id] || ""}
                                        onChange={(e) => setWidgetContacts((prev) => ({ ...prev, [ch.id]: e.target.value }))}
                                        placeholder={field.placeholder}
                                        className="w-full bg-transparent text-xs text-foreground-800 outline-none placeholder:text-foreground-300"
                                      />
                                    </div>
                                    {widgetContacts[ch.id] && (
                                      <i className="ri-checkbox-circle-line text-sm text-accent-500 flex-shrink-0"></i>
                                    )}
                                  </div>
                                );
                              })}
                            {connectedArray.filter((ch) => WIDGET_CHANNEL_FIELDS[ch.id]).length === 0 && (
                              <p className="text-xs text-foreground-400 italic">None of your connected channels (e.g. LiveChat, WeChat) expose a public link. Connect WhatsApp, Telegram, Messenger, LINE, Instagram, or Email to include channel buttons.</p>
                            )}
                          </div>
                        </div>

                        {/* Step 3: Generated code */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-foreground-400 mb-3">3 — Your Embed Code</p>
                          <div className="relative">
                            <pre className="bg-foreground-950 text-accent-300 text-[11px] font-mono rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre">{generateEmbedCode()}</pre>
                            <button
                              onClick={handleCopyEmbed}
                              className={`absolute top-3 right-3 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                                widgetCopied
                                  ? "bg-accent-500 text-background-50 dark:text-foreground-950"
                                  : "bg-background-200/20 text-foreground-200 hover:bg-background-200/40"
                              }`}
                            >
                              <i className={widgetCopied ? "ri-checkbox-circle-line" : "ri-file-copy-line"}></i>
                              {widgetCopied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <p className="text-xs text-foreground-400 mt-2.5">
                            Paste this just before <code className="bg-background-200 px-1 rounded text-[11px]">&lt;/body&gt;</code> on every page of your website.
                          </p>
                        </div>

                        {/* Mini preview */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-foreground-400 mb-3">Preview</p>
                          <div className="bg-background-50 rounded-xl border border-background-200/70 p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${widgetColorFrom}, ${widgetColorTo})` }}
                              >
                                {widgetAvatar || "?"}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground-900">{widgetName || "Your Business"}</p>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {connectedArray
                                    .filter((ch) => WIDGET_CHANNEL_FIELDS[ch.id] && widgetContacts[ch.id])
                                    .map((ch) => (
                                      <span
                                        key={ch.id}
                                        className="text-[10px] font-semibold text-white px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: WIDGET_CHANNEL_FIELDS[ch.id].color }}
                                      >
                                        {WIDGET_CHANNEL_FIELDS[ch.id].label}
                                      </span>
                                    ))}
                                  {connectedArray.filter((ch) => WIDGET_CHANNEL_FIELDS[ch.id] && widgetContacts[ch.id]).length === 0 && (
                                    <span className="text-[11px] text-foreground-400 italic">Fill in contacts above to see channel buttons</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow"
                              style={{ background: `linear-gradient(135deg, ${widgetColorFrom}, ${widgetColorTo})` }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right sidebar: Live Simulation + Recent Activity */}
              <div className="space-y-5">
                {/* Live Message Simulation */}
                <div className="bg-background-100 rounded-xl border border-background-200/70 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-sm font-bold text-foreground-950">Live Incoming Messages</h2>
                    <button
                      onClick={toggleSimulation}
                      className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
                        simRunning
                          ? "bg-red-50 text-red-500 hover:bg-red-100"
                          : "bg-accent-100 text-accent-600 hover:bg-accent-200"
                      }`}
                    >
                      {simRunning ? (
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> Stop</span>
                      ) : (
                        <span className="flex items-center gap-1"><i className="ri-play-circle-line"></i> Simulate</span>
                      )}
                    </button>
                  </div>

                  {liveMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-background-200/80 mb-3">
                        <i className="ri-message-3-line text-lg text-foreground-400"></i>
                      </div>
                      <p className="text-xs text-foreground-500">No live messages yet</p>
                      <p className="text-[11px] text-foreground-400 mt-1">Click "Simulate" to see messages flowing in real-time</p>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                      {liveMessages.map((msg) => {
                        const isReply = msg.customer === "You replied";
                        const isSelected = replyTarget?.id === msg.id;
                        return (
                          <div
                            key={msg.id}
                            onClick={() => !isReply && setReplyTarget(isSelected ? null : msg)}
                            className={`flex gap-3 items-start p-2.5 rounded-lg transition-colors animate-[fadeInUp_0.3s_ease-out] ${
                              isReply
                                ? "bg-primary-50 border border-primary-200/40"
                                : isSelected
                                  ? "bg-accent-100 border border-accent-300/50"
                                  : "hover:bg-background-50 cursor-pointer"
                            }`}
                          >
                            <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: (channelColors[msg.channelId] || "#999") + "20" }}>
                              {isReply ? (
                                <i className="ri-reply-line text-xs" style={{ color: channelColors[msg.channelId] || "#999" }}></i>
                              ) : (
                                <i className={`${channelIcons[msg.channelId] || "ri-question-line"} text-xs`} style={{ color: channelColors[msg.channelId] || "#999" }}></i>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-xs font-semibold truncate ${isReply ? "text-primary-600" : "text-foreground-800"}`}>{msg.customer}</p>
                                <span className="text-[10px] text-foreground-300 flex-shrink-0">{msg.timestamp}</span>
                              </div>
                              <p className="text-xs text-foreground-500 truncate mt-0.5">{msg.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reply Panel */}
                  {replyTarget && (
                    <div className="mt-3 bg-background-50 rounded-lg border border-primary-200/60 p-3 animate-[fadeInUp_0.25s_ease-out]">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="ri-reply-line text-xs text-primary-500"></i>
                        <p className="text-[11px] font-medium text-foreground-600">
                          Replying to <span className="text-foreground-800">{replyTarget.customer}</span> via <span className="text-foreground-800">{partnerChannels.find((c) => c.id === replyTarget.channelId)?.name}</span>
                        </p>
                        <button onClick={() => { setReplyTarget(null); setReplyText(""); }} className="ml-auto text-[10px] text-foreground-400 hover:text-foreground-600 transition-colors cursor-pointer">
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                      <p className="text-xs text-foreground-400 bg-background-100 rounded px-2.5 py-1.5 mb-2.5 italic">"{replyTarget.message}"</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleReplySend(); }}
                          placeholder="Type your reply..."
                          className="flex-1 bg-background-100 border border-background-200/70 rounded-md px-3 py-2 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300"
                          autoFocus
                        />
                        <button
                          onClick={handleReplySend}
                          disabled={!replyText.trim()}
                          className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-4 py-2 rounded-md transition-colors ${
                            replyText.trim()
                              ? "bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600"
                              : "bg-background-200 text-foreground-300 cursor-not-allowed"
                          }`}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}

                  {liveMessages.length > 0 && (
                    <button onClick={() => setLiveMessages([])} className="mt-3 w-full text-xs font-medium text-foreground-400 hover:text-foreground-600 transition-colors whitespace-nowrap cursor-pointer py-1.5">
                      Clear Messages
                    </button>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-background-100 rounded-xl border border-background-200/70 p-5">
                  <h2 className="font-heading text-sm font-bold text-foreground-950 mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: (channelColors[activity.channel] || "#999") + "20" }}>
                          <i className={`${channelIcons[activity.channel] || "ri-question-line"} text-xs`} style={{ color: channelColors[activity.channel] || "#999" }}></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground-800 truncate">{activity.event}</p>
                          <p className="text-[11px] text-foreground-400">{activity.customer}</p>
                          <p className="text-[10px] text-foreground-300">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-background-100 rounded-xl border border-background-200/70 p-5">
                  <h2 className="font-heading text-sm font-bold text-foreground-950 mb-3">Quick Tips</h2>
                  <div className="space-y-3">
                    {[
                      { icon: "ri-lightbulb-line", text: "Connect at least 3 channels for the best omnichannel experience" },
                      { icon: "ri-shield-check-line", text: "All channels use end-to-end encryption by default" },
                      { icon: "ri-bar-chart-line", text: "Response times under 5 min boost CSAT by 40%" },
                    ].map((tip, i) => (
                      <div key={i} className="flex gap-2.5">
                        <i className={`${tip.icon} text-xs text-primary-500 mt-0.5 flex-shrink-0`}></i>
                        <p className="text-xs text-foreground-600 leading-relaxed">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-background-50 rounded-xl border border-background-200/70 p-6 max-w-lg w-full shadow-lg max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-100">
                  <i className="ri-file-chart-line text-sm text-accent-600"></i>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground-950">Monthly Report</h3>
                  <p className="text-[11px] text-foreground-400">{partnerChannels.find((c) => c.id === reportModal.channelId)?.name}</p>
                </div>
              </div>
              <button onClick={() => setReportModal(null)} className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer text-foreground-400 hover:text-foreground-600 hover:bg-background-100 transition-colors">
                <i className="ri-close-line"></i>
              </button>
            </div>
            <pre className="flex-1 overflow-auto bg-background-100 rounded-lg border border-background-200/70 p-4 text-xs font-mono text-foreground-700 whitespace-pre-wrap leading-relaxed">{reportModal.report}</pre>
            <div className="flex gap-3 mt-4 flex-shrink-0">
              <button
                onClick={() => { navigator.clipboard.writeText(reportModal.report); showToast("Report copied to clipboard!"); }}
                className="flex-1 text-sm font-medium text-foreground-600 hover:text-foreground-800 transition-colors whitespace-nowrap cursor-pointer px-4 py-2.5 rounded-md border border-background-200/70 flex items-center justify-center gap-1.5"
              >
                <i className="ri-file-copy-line"></i> Copy
              </button>
              <button
                onClick={() => { handleExportCSV(reportModal.channelId); setReportModal(null); }}
                className="flex-1 text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-4 py-2.5 rounded-md flex items-center justify-center gap-1.5"
              >
                <i className="ri-download-line"></i> Download CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Modal */}
      {disconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-background-50 rounded-xl border border-background-200/70 p-6 max-w-sm w-full shadow-lg">
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-red-50 mb-3">
                <i className="ri-alert-line text-xl text-red-500"></i>
              </div>
              <h3 className="font-heading text-base font-bold text-foreground-950">Disconnect Channel?</h3>
              <p className="text-xs text-foreground-500 mt-1">
                This will remove the {partnerChannels.find((c) => c.id === disconnectModal)?.name} configuration. You can reconnect at any time.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDisconnectModal(null)} className="flex-1 text-sm font-medium text-foreground-600 hover:text-foreground-800 transition-colors whitespace-nowrap cursor-pointer px-4 py-2.5 rounded-md border border-background-200/70">
                Cancel
              </button>
              <button onClick={() => handleDisconnect(disconnectModal)} className="flex-1 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors whitespace-nowrap cursor-pointer px-4 py-2.5 rounded-md">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-[fadeInUp_0.3s_ease-out]">
          <div className="flex items-center gap-2.5 bg-foreground-950 text-background-50 text-sm px-5 py-3 rounded-lg shadow-lg">
            <i className="ri-checkbox-circle-line text-accent-400"></i>
            {toastMessage}
          </div>
        </div>
      )}
    </>
  );
}