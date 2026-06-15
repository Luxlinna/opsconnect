import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL              = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GROQ_API_KEY              = Deno.env.get("GROQ_API_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Content-Type":                 "application/json",
};

type Topic = { label: string; content: string };

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const url       = new URL(req.url);
  const partnerId = url.searchParams.get("partner_id") ?? "";

  if (!partnerId) {
    return new Response(JSON.stringify({ topics: [] }), { headers: CORS });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: partner } = await supabase
    .from("partners")
    .select("ai_business_context")
    .eq("partner_id", partnerId)
    .maybeSingle();

  const context = (partner?.ai_business_context as string | null) ?? "";
  if (!context.trim()) {
    return new Response(JSON.stringify({ topics: [] }), { headers: CORS });
  }

  // Extract topic labels AND their content from the business context
  const apiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:       "llama-3.1-8b-instant",
      max_tokens:  400,
      temperature: 0,
      messages: [
        {
          role:    "system",
          content: "Return ONLY a valid JSON array of objects. No explanation, no markdown, no code block.",
        },
        {
          role:    "user",
          content: `From the business information below, extract 4–6 topics a customer might want to know about.

For each topic provide:
- "label": a short button text (2–4 words, e.g. "Shop Products")
- "content": the actual helpful answer/info for that topic from the context (1–2 sentences, include the URL if present)

Business info:
${context}

Return ONLY a JSON array like:
[
  {"label": "Shop Products", "content": "Browse our full product range at https://www.ballangkmall.com/products"},
  {"label": "Register Account", "content": "Create your free account at https://www.ballangkmall.com/register"}
]`,
        },
      ],
    }),
  });

  let topics: Topic[] = [];
  if (apiRes.ok) {
    const aiData = await apiRes.json() as { choices?: Array<{ message?: { content?: string } }> };
    const raw    = aiData.choices?.[0]?.message?.content ?? "[]";
    try {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) topics = JSON.parse(match[0]) as Topic[];
    } catch { /* return empty */ }
  }

  return new Response(JSON.stringify({ topics }), { headers: CORS });
});
