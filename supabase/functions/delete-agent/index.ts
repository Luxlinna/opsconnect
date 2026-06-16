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

  const agentId = body.agent_id as string | undefined;

  if (!agentId) {
    return new Response(JSON.stringify({ error: "agent_id required" }), { status: 400, headers: CORS });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Fetch user_id before deleting the row
  const { data: agent } = await supabase
    .from("partner_agents")
    .select("user_id")
    .eq("id", agentId)
    .maybeSingle();

  // Delete the row
  const { error } = await supabase.from("partner_agents").delete().eq("id", agentId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: CORS });
  }

  // Delete the Supabase Auth user so they can't log in anymore
  if (agent?.user_id) {
    await supabase.auth.admin.deleteUser(agent.user_id as string);
  }

  return new Response(JSON.stringify({ ok: true }), { headers: CORS });
});
