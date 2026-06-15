/**
 * chat-support — receives visitor info from the embedded OPSConnect chat widget.
 *
 * POST body: { partner_id, visitor_name, visitor_contact, message, company?, topic? }
 * Inserts a row into public.support_requests.
 * Must be called with the public anon key (no auth required — it's a public widget).
 */

import { createClient } from "@supabase/supabase-js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: {
    partner_id?: string;
    visitor_name?: string;
    visitor_contact?: string;
    message?: string;
    company?: string;
    topic?: string;
  };

  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { partner_id, visitor_name, visitor_contact, message, company, topic } = body;

  if (!visitor_name?.trim() || !visitor_contact?.trim() || !message?.trim()) {
    return json({ error: "visitor_name, visitor_contact, and message are required" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  const { error } = await supabase.from("support_requests").insert({
    partner_id:      partner_id?.trim() || null,
    visitor_name:    visitor_name.trim(),
    visitor_contact: visitor_contact.trim(),
    message:         message.trim(),
    company:         company?.trim() || null,
    topic:           topic?.trim() || null,
    status:          "new",
  });

  if (error) {
    console.error("chat-support insert error:", error);
    return json({ error: "Failed to save support request" }, 500);
  }

  return json({ ok: true });
});
