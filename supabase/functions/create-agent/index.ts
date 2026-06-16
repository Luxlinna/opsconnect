import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL              = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Content-Type":                 "application/json",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: CORS });
  }

  let body: Record<string, unknown>;
  try { body = await req.json() as Record<string, unknown>; }
  catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: CORS }); }

  const partnerId   = body.partner_id   as string | undefined;
  const name        = body.name         as string | undefined;
  const email       = body.email        as string | undefined;
  const password    = body.password     as string | undefined;
  const role        = (body.role        as string | undefined) ?? "Agent";
  const avatarColor = (body.avatar_color as string | undefined) ?? "#6366f1";

  if (!partnerId || !name || !email || !password) {
    return new Response(
      JSON.stringify({ error: "partner_id, name, email and password are required" }),
      { status: 400, headers: CORS }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Create Supabase Auth user — auto-confirm so agent can log in immediately
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return new Response(JSON.stringify({ error: authError.message }), { status: 400, headers: CORS });
  }

  const userId = authData.user?.id;

  // Insert into partner_agents
  const { data: agent, error: insertError } = await supabase
    .from("partner_agents")
    .insert({ partner_id: partnerId, user_id: userId, name, email, role, avatar_color: avatarColor })
    .select("id, name, email, role, avatar_color, created_at")
    .single();

  if (insertError) {
    if (userId) await supabase.auth.admin.deleteUser(userId);
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500, headers: CORS });
  }

  return new Response(JSON.stringify({ agent }), { headers: CORS });
});
