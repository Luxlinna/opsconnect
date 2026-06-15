import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPartners, clearSession, PartnerRecord } from "@/utils/auth";

const CHANNEL_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  whatsapp:  { label: "WhatsApp",  icon: "ri-whatsapp-line",  color: "#25D366" },
  messenger: { label: "Messenger", icon: "ri-messenger-line", color: "#0084FF" },
  telegram:  { label: "Telegram",  icon: "ri-telegram-line",  color: "#26A5E4" },
  instagram: { label: "Instagram", icon: "ri-instagram-line", color: "#E4405F" },
  line:      { label: "LINE",      icon: "ri-line-line",      color: "#00C300" },
  email:     { label: "Email",     icon: "ri-mail-line",      color: "#EA4335" },
  wechat:    { label: "WeChat",    icon: "ri-wechat-line",    color: "#07C160" },
  livechat:  { label: "LiveChat",  icon: "ri-chat-3-line",    color: "#1E7FC2" },
};

function getInitials(name: string) {
  const words = name.split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch { return iso; }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getAllPartners().then((data) => {
      setPartners(data);
      setLoadingPartners(false);
    });
  }, []);

  const filtered = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSignOut = async () => {
    await clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background-50">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-background-100 border-b border-background-200/70 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-heading text-lg font-bold text-foreground-950">
            OPS<span className="text-primary-500">Connect</span>
          </span>
          <span className="text-xs bg-accent-100 text-accent-600 font-semibold px-2 py-0.5 rounded-full border border-accent-200">
            Admin Panel
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs font-medium text-foreground-500 hover:text-foreground-800 transition-colors cursor-pointer"
        >
          <i className="ri-logout-box-line"></i> Sign out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Partners", value: partners.length, icon: "ri-building-line", color: "text-primary-500" },
            { label: "Active Channels", value: partners.reduce((a, p) => a + (p.channels?.length ?? 0), 0), icon: "ri-links-line", color: "text-accent-500" },
            { label: "Avg Channels", value: partners.length ? (partners.reduce((a, p) => a + (p.channels?.length ?? 0), 0) / partners.length).toFixed(1) : "—", icon: "ri-bar-chart-line", color: "text-secondary-500" },
            { label: "Registered Today", value: partners.filter((p) => new Date(p.createdAt).toDateString() === new Date().toDateString()).length, icon: "ri-calendar-check-line", color: "text-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-background-100 border border-background-200/70 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <i className={`${stat.icon} text-sm ${stat.color}`}></i>
                <span className="text-xs text-foreground-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground-950">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search + heading */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-heading text-lg font-bold text-foreground-950">All Partners</h2>
          <div className="relative max-w-xs w-full">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or ID…"
              className="w-full bg-background-100 border border-background-200/70 rounded-lg pl-9 pr-4 py-2 text-xs text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300 transition-colors"
            />
          </div>
        </div>

        {loadingPartners ? (
          <div className="text-center py-16">
            <span className="w-6 h-6 border-2 border-primary-400 border-t-primary-600 rounded-full animate-spin inline-block" />
            <p className="text-xs text-foreground-400 mt-3">Loading partners from database…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-foreground-400">
            <i className="ri-user-search-line text-4xl mb-2 block"></i>
            {partners.length === 0 ? "No partners have registered yet." : "No partners match your search."}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((partner) => {
              const isExpanded = expanded === partner.id;
              return (
                <div key={partner.id} className="bg-background-100 border border-background-200/70 rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer hover:bg-background-200/30 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : partner.id)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-600">{getInitials(partner.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground-900 truncate">{partner.name}</p>
                      <p className="text-xs text-foreground-400 truncate">{partner.email}</p>
                    </div>
                    <code className="hidden sm:block text-xs bg-background-200/60 text-foreground-600 font-mono px-2 py-1 rounded-lg flex-shrink-0">
                      {partner.id}
                    </code>
                    <div className="flex items-center gap-1 text-xs text-foreground-500 flex-shrink-0">
                      <i className="ri-links-line"></i>
                      <span>{partner.channels?.length ?? 0} ch</span>
                    </div>
                    <span className="hidden md:block text-xs text-foreground-400 flex-shrink-0">
                      {formatDate(partner.createdAt)}
                    </span>
                    <i className={`ri-arrow-down-s-line text-foreground-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}></i>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-background-200/50 pt-4">
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-semibold text-foreground-500 mb-1">Partner ID</p>
                          <code className="text-xs font-mono bg-background-200/60 px-2 py-1 rounded text-foreground-700">{partner.id}</code>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground-500 mb-1">Registered</p>
                          <p className="text-xs text-foreground-700">{formatDate(partner.createdAt)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground-500 mb-2">Connected Channels</p>
                        {!partner.channels || partner.channels.length === 0 ? (
                          <p className="text-xs text-foreground-400 italic">No channels connected</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {partner.channels.map((ch) => {
                              const meta = CHANNEL_LABELS[ch] ?? { label: ch, icon: "ri-question-line", color: "#999" };
                              return (
                                <div
                                  key={ch}
                                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border"
                                  style={{ borderColor: meta.color + "40", backgroundColor: meta.color + "15", color: meta.color }}
                                >
                                  <i className={`${meta.icon} text-sm`}></i>
                                  {meta.label}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
