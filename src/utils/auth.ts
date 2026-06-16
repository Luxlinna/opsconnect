import { supabase } from "./supabase/client";

export interface Session {
  role: "partner" | "admin" | "agent";
  partnerId: string;
  partnerDbId?: string;   // UUID — used for messages table queries
  partnerName: string;
  email: string;
  agentName?: string;
  agentRole?: string;     // 'Admin' | 'Agent' | 'Viewer'
}

export interface PartnerRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  channels: string[];
}

export const ADMIN_EMAIL = "admin@opsconnect.io";
export const ADMIN_PASSWORD = "admin123";

// ── Local storage helpers ─────────────────────────────────────────────────────

function getLocalSession(): Session | null {
  try {
    const s = localStorage.getItem("omni_session");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function setLocalSession(session: Session | null) {
  if (session) {
    localStorage.setItem("omni_session", JSON.stringify(session));
    localStorage.setItem("omni_partner_name", session.partnerName);
    localStorage.setItem("omni_partner_id", session.partnerId);
  } else {
    localStorage.removeItem("omni_session");
    localStorage.removeItem("omni_partner_name");
    localStorage.removeItem("omni_partner_id");
  }
}

// ── Session ───────────────────────────────────────────────────────────────────

export async function getSession(): Promise<Session | null> {
  // Admin: kept in localStorage (no Supabase user needed)
  const local = getLocalSession();
  if (local?.role === "admin") return local;

  // Partner/Agent: check Supabase Auth session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  // Check if partner first
  const { data: partner } = await supabase
    .from("partners")
    .select("id, partner_id, partner_name, email")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (partner) {
    const s: Session = {
      role: "partner",
      partnerId: partner.partner_id,
      partnerDbId: partner.id,
      partnerName: partner.partner_name,
      email: partner.email ?? session.user.email ?? "",
    };
    setLocalSession(s);
    return s;
  }

  // Check if agent
  const { data: agent } = await supabase
    .from("partner_agents")
    .select("id, name, email, role, partner_id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (agent) {
    const { data: partnerData } = await supabase
      .from("partners")
      .select("partner_name")
      .eq("partner_id", agent.partner_id)
      .maybeSingle();
    const s: Session = {
      role: "agent",
      partnerId: agent.partner_id as string,
      partnerName: (partnerData?.partner_name as string) ?? "",
      email: agent.email as string,
      agentName: agent.name as string,
      agentRole: agent.role as string,
    };
    setLocalSession(s);
    return s;
  }

  return null;
}

// ── Sign in ───────────────────────────────────────────────────────────────────

export async function signIn(
  email: string,
  password: string
): Promise<{ session: Session | null; error: string | null }> {
  const trimEmail = email.trim().toLowerCase();

  // Admin: hardcoded, stored locally
  if (trimEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const s: Session = { role: "admin", partnerId: "ADMIN", partnerName: "Admin", email: ADMIN_EMAIL };
    setLocalSession(s);
    return { session: s, error: null };
  }

  // Partner: Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({ email: trimEmail, password });
  if (error) return { session: null, error: "Invalid email or password." };

  const s = await getSession();
  return { session: s, error: s ? null : "Partner profile not found." };
}

// ── Sign up ───────────────────────────────────────────────────────────────────

export async function forgotPassword(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error: error ? error.message : null };
}

export async function resetPassword(newPassword: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error ? error.message : null };
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  channels: string[]
): Promise<{ session: Session | null; needsConfirmation: boolean; error: string | null }> {
  const trimEmail = email.trim().toLowerCase();
  const partnerId = generatePartnerId();

  // Create Supabase Auth user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: trimEmail,
    password,
    options: { data: { name, partner_id: partnerId } },
  });

  if (signUpError) return { session: null, needsConfirmation: false, error: signUpError.message };
  if (!authData.user) return { session: null, needsConfirmation: false, error: "Registration failed. Please try again." };

  // Check if this auth user already has a partner record (duplicate registration attempt)
  const { data: existingPartner } = await supabase
    .from("partners")
    .select("partner_id, partner_name")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (existingPartner) {
    // Already registered — if they have a session, sign them in; otherwise ask them to confirm email
    if (authData.session) {
      const s: Session = { role: "partner", partnerId: existingPartner.partner_id, partnerName: existingPartner.partner_name, email: trimEmail };
      setLocalSession(s);
      return { session: s, needsConfirmation: false, error: null };
    }
    return { session: null, needsConfirmation: true, error: null };
  }

  // Insert into partners table
  const { error: profileError } = await supabase.from("partners").insert({
    partner_name: name.trim(),
    partner_id:   partnerId,
    user_id:      authData.user.id,
    email:        trimEmail,
  });

  if (profileError) return { session: null, needsConfirmation: false, error: "Failed to save partner profile: " + profileError.message };

  // Insert into channel_configs table for each selected channel
  if (channels.length > 0) {
    const { error: chError } = await supabase.from("channel_configs").insert(
      channels.map((ch) => ({
        partner_id:  partnerId,
        channel_id:  ch,
        configured:  true,
      }))
    );
    if (chError) console.warn("Channel configs insert error:", chError.message);
  }

  // Sync to localStorage for dashboard channel state
  localStorage.setItem(
    "omni_completed_setups",
    JSON.stringify(channels.reduce((acc: Record<string, boolean>, ch) => ({ ...acc, [ch]: true }), {}))
  );

  // Email confirmation required — session will be null until user confirms
  if (!authData.session) {
    return { session: null, needsConfirmation: true, error: null };
  }

  const s: Session = { role: "partner", partnerId, partnerName: name.trim(), email: trimEmail };
  setLocalSession(s);
  return { session: s, needsConfirmation: false, error: null };
}

// ── Sign out ──────────────────────────────────────────────────────────────────

export async function clearSession(): Promise<void> {
  await supabase.auth.signOut();
  setLocalSession(null);
}

// ── Partner data ──────────────────────────────────────────────────────────────

export async function getAllPartners(): Promise<PartnerRecord[]> {
  const { data, error } = await supabase
    .from("partners")
    .select(`
      partner_id,
      partner_name,
      email,
      created_at,
      channel_configs ( channel_id, configured )
    `)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((p) => ({
    id:        p.partner_id,
    name:      p.partner_name,
    email:     (p.email as string) ?? "",
    password:  "",
    createdAt: p.created_at as string,
    channels:  ((p.channel_configs as { channel_id: string; configured: boolean }[]) ?? [])
                 .filter((c) => c.configured)
                 .map((c) => c.channel_id),
  }));
}

export async function getPartnerChannels(partnerId: string): Promise<string[]> {
  const { data } = await supabase
    .from("channel_configs")
    .select("channel_id")
    .eq("partner_id", partnerId)
    .eq("configured", true);

  if (data?.length) return data.map((c) => c.channel_id as string);

  // Fallback: localStorage channel state (for channels set up via dashboard wizard)
  const saved = localStorage.getItem("omni_completed_setups");
  if (saved) {
    try {
      const completed = JSON.parse(saved);
      return Object.keys(completed).filter((k) => completed[k]);
    } catch { return []; }
  }
  return [];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function generatePartnerId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "PART-";
  for (let i = 0; i < 4; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  id += "-";
  for (let i = 0; i < 4; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

// Legacy stubs — kept so existing imports don't break
export function setSession(session: Session) { setLocalSession(session); }
export function findPartnerByEmail(_email: string): null { return null; }
export function savePartner(_partner: PartnerRecord): void { /* handled by Supabase */ }
