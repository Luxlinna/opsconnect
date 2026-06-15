import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL             = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Content-Type":                 "application/json",
};

type AiMessage = { role: string; content: string };

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const url      = new URL(req.url);

  // ── GET: poll for new agent messages ──────────────────────────────────────
  if (req.method === "GET") {
    const chatId = url.searchParams.get("chat_id");
    const since  = url.searchParams.get("since");

    if (!chatId) {
      return new Response(JSON.stringify({ error: "chat_id required" }), { status: 400, headers: CORS });
    }

    let query = supabase
      .from("live_chat_messages")
      .select("role, sender_name, content, created_at")
      .eq("chat_id", chatId)
      .eq("role", "agent")
      .order("created_at", { ascending: true });

    if (since) query = query.gt("created_at", since);

    const { data, error } = await query;
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: CORS });
    }
    return new Response(JSON.stringify({ messages: data ?? [] }), { headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: CORS });
  }

  let body: Record<string, unknown>;
  try { body = await req.json() as Record<string, unknown>; }
  catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: CORS });
  }

  const action = body.action as string;

  // ── POST action=start: create live chat session ───────────────────────────
  if (action === "start") {
    const partnerId    = body.partner_id     as string | undefined;
    const visitorName  = body.visitor_name   as string | undefined;
    const visitorContact = body.visitor_contact as string | undefined;
    const initialMsg   = body.initial_message as string | undefined;
    const aiHistory    = body.ai_history     as AiMessage[] | undefined;

    if (!partnerId || !visitorName || !visitorContact) {
      return new Response(
        JSON.stringify({ error: "partner_id, visitor_name, visitor_contact required" }),
        { status: 400, headers: CORS }
      );
    }

    const { data: chat, error: chatErr } = await supabase
      .from("live_chats")
      .insert({
        partner_id:      partnerId,
        visitor_name:    visitorName,
        visitor_contact: visitorContact,
        initial_message: initialMsg ?? null,
        status:          "waiting",
      })
      .select("id")
      .single();

    if (chatErr || !chat) {
      return new Response(
        JSON.stringify({ error: chatErr?.message ?? "Failed to create chat" }),
        { status: 500, headers: CORS }
      );
    }

    // Save the AI conversation history so agents see full context
    if (aiHistory && aiHistory.length > 0) {
      const rows = aiHistory.slice(-20).map((msg) => ({
        chat_id:     chat.id,
        role:        msg.role === "user" ? "visitor" : "ai",
        sender_name: msg.role === "user" ? visitorName : "AI Assistant",
        content:     msg.content,
      }));
      await supabase.from("live_chat_messages").insert(rows);
    }

    return new Response(JSON.stringify({ chat_id: chat.id }), { headers: CORS });
  }

  // ── POST action=message: visitor sends a follow-up message ─────────────────
  if (action === "message") {
    const chatId      = body.chat_id      as string | undefined;
    const content     = body.content      as string | undefined;
    const visitorName = body.visitor_name as string | undefined;

    if (!chatId || !content) {
      return new Response(
        JSON.stringify({ error: "chat_id and content required" }),
        { status: 400, headers: CORS }
      );
    }

    const { error } = await supabase.from("live_chat_messages").insert({
      chat_id:     chatId,
      role:        "visitor",
      sender_name: visitorName ?? "Visitor",
      content,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: CORS });
    }
    return new Response(JSON.stringify({ ok: true }), { headers: CORS });
  }

  return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: CORS });
});
