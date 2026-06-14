import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";

const PAGE_SIZE = 20;

const STATUSES = ["all", "new", "read", "resolved"] as const;
type StatusFilter = typeof STATUSES[number];

const STATUS_CLS: Record<string, string> = {
  new:      "bg-red-100 text-red-600",
  read:     "bg-blue-100 text-blue-600",
  resolved: "bg-green-100 text-green-600",
};

interface SupportRequest {
  id: string;
  partner_id: string | null;
  visitor_name: string;
  visitor_contact: string;
  company: string | null;
  message: string;
  status: "new" | "read" | "resolved";
  created_at: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <span className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ text = "No support requests yet" }: { text?: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-background-200/80 mb-4">
        <i className="ri-customer-service-2-line text-xl text-foreground-400" />
      </div>
      <p className="text-sm font-semibold text-foreground-700">{text}</p>
      <p className="text-xs text-foreground-500 mt-1">
        Visitor inquiries from the chat widget will appear here.
      </p>
    </div>
  );
}

interface Props { partnerId: string | null }

export default function SupportRequests({ partnerId }: Props) {
  const [open, setOpen]           = useState(true);
  const [requests, setRequests]   = useState<SupportRequest[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(0);
  const [loading, setLoading]     = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch]       = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [updating, setUpdating]   = useState<string | null>(null);
  const [newCount, setNewCount]   = useState(0);

  const fetchRequests = useCallback(async () => {
    if (!partnerId) return;
    setLoading(true);
    let q = supabase
      .from("support_requests")
      .select("*", { count: "exact" })
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    if (search) q = q.or(`visitor_name.ilike.%${search}%,visitor_contact.ilike.%${search}%,company.ilike.%${search}%,message.ilike.%${search}%`);
    const { data, count } = await q;
    setRequests((data as SupportRequest[]) ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [partnerId, page, statusFilter, search]);

  const fetchNewCount = useCallback(async () => {
    if (!partnerId) return;
    const { count } = await supabase
      .from("support_requests")
      .select("*", { count: "exact", head: true })
      .eq("partner_id", partnerId)
      .eq("status", "new");
    setNewCount(count ?? 0);
  }, [partnerId]);

  useEffect(() => {
    if (open && partnerId) { fetchRequests(); fetchNewCount(); }
  }, [open, partnerId, fetchRequests, fetchNewCount]);

  const updateStatus = async (id: string, status: "read" | "resolved") => {
    setUpdating(id);
    await supabase.from("support_requests").update({ status }).eq("id", id);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    setUpdating(null);
    fetchNewCount();
  };

  const doSearch = () => { setSearch(searchInput); setPage(0); };
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-lg font-bold text-foreground-950">Support Requests</h2>
          {newCount > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
              {newCount} new
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs font-medium text-foreground-600 hover:text-primary-500 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <i className="ri-customer-service-2-line" /> {open ? "Hide Requests" : "View Requests"}
        </button>
      </div>

      {open && (
        <div className="bg-background-100 rounded-xl border border-background-200/70 p-5 md:p-6 space-y-5 animate-[fadeInUp_0.3s_ease-out]">

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Status tabs */}
            <div className="flex gap-1 bg-background-50 border border-background-200/70 rounded-lg p-0.5">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(0); }}
                  className={`text-xs font-semibold whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-md transition-colors capitalize ${statusFilter === s ? "bg-primary-500 text-background-50 dark:text-foreground-950" : "text-foreground-600 hover:bg-background-100"}`}>
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex gap-2 flex-1 min-w-[200px]">
              <div className="flex-1 flex items-center gap-2 bg-background-50 border border-background-200/70 rounded-lg px-3 py-1.5">
                <i className="ri-search-line text-xs text-foreground-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSearch()}
                  placeholder="Search by name, contact, or message…"
                  className="flex-1 bg-transparent text-xs text-foreground-800 outline-none placeholder:text-foreground-300"
                />
                {searchInput && (
                  <button onClick={() => { setSearchInput(""); setSearch(""); setPage(0); }} className="text-foreground-400 hover:text-foreground-600 cursor-pointer text-xs">
                    <i className="ri-close-line" />
                  </button>
                )}
              </div>
              <button onClick={doSearch} className="text-xs font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-4 py-1.5 rounded-lg">
                Search
              </button>
            </div>
          </div>

          <p className="text-xs text-foreground-500">
            {loading ? "Loading…" : `${total.toLocaleString()} request${total !== 1 ? "s" : ""}`}
          </p>

          {loading ? <Spinner /> : requests.length === 0 ? <EmptyState /> : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="bg-background-50 rounded-lg border border-background-200/70 px-4 py-4 hover:border-background-300 transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    {/* Left: visitor info */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="ri-user-3-line text-sm text-primary-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground-900">{req.visitor_name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_CLS[req.status]}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-foreground-500 flex items-center gap-1">
                            <i className="ri-mail-line text-[10px]" />{req.visitor_contact}
                          </span>
                          {req.company && (
                            <span className="text-xs text-foreground-400 flex items-center gap-1">
                              <i className="ri-building-line text-[10px]" />{req.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: time + actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-foreground-400">{fmtDate(req.created_at)}</span>
                      {req.status === "new" && (
                        <button
                          onClick={() => updateStatus(req.id, "read")}
                          disabled={updating === req.id}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          Mark Read
                        </button>
                      )}
                      {req.status !== "resolved" && (
                        <button
                          onClick={() => updateStatus(req.id, "resolved")}
                          disabled={updating === req.id}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          {updating === req.id ? "…" : "Resolve"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mt-3 bg-background-100 rounded-lg px-3 py-2.5">
                    <p className="text-xs text-foreground-700 leading-relaxed">{req.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                className="text-xs font-medium px-3 py-1.5 rounded-md bg-background-50 border border-background-200/70 text-foreground-600 hover:bg-background-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                <i className="ri-arrow-left-s-line" /> Prev
              </button>
              <span className="text-xs text-foreground-500 px-2">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                className="text-xs font-medium px-3 py-1.5 rounded-md bg-background-50 border border-background-200/70 text-foreground-600 hover:bg-background-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                Next <i className="ri-arrow-right-s-line" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
