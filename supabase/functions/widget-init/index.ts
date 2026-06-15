import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL              = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GROQ_API_KEY              = Deno.env.get("GROQ_API_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Content-Type":                 "application/json",
};

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

  // Use the fast 8b model just to extract topic labels from the context
  const apiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:      "llama-3.1-8b-instant",
      max_tokens: 120,
      temperature: 0,
      messages: [
        {
          role:    "system",
          content: "Return ONLY a valid JSON array of short strings (2–5 words each). No explanation, no markdown, no code block.",
        },
        {
          role:    "user",
          content: `From the business information below, extract 4–6 short topic labels that a customer might want to ask about. Each label should be 2–5 words.\n\nBusiness info:\n${context}\n\nReturn ONLY a JSON array, e.g.: ["Shop Products", "Register Account", "Affiliate Program"]`,
        },
      ],
    }),
  });

  let topics: string[] = [];
  if (apiRes.ok) {
    const aiData = await apiRes.json() as { choices?: Array<{ message?: { content?: string } }> };
    const raw    = aiData.choices?.[0]?.message?.content ?? "[]";
    try {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) topics = JSON.parse(match[0]) as string[];
    } catch { /* return empty */ }
  }

  return new Response(JSON.stringify({ topics }), { headers: CORS });
});
