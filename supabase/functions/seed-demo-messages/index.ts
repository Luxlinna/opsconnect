import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL              = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CHANNELS  = ["whatsapp", "telegram", "messenger", "instagram", "line", "wechat"];
const SENDERS   = [
  { id: "c_001", name: "Emma Rodriguez" },
  { id: "c_002", name: "James Kim"      },
  { id: "c_003", name: "Sarah Thompson" },
  { id: "c_004", name: "Liam Patel"     },
  { id: "c_005", name: "Yuki Tanaka"    },
  { id: "c_006", name: "Maria Garcia"   },
  { id: "c_007", name: "Noah Williams"  },
  { id: "c_008", name: "Aisha Malik"    },
];
const IN_TEXTS  = [
  "Hi, I need help with my recent order",
  "When will my package arrive?",
  "I'd like to upgrade my plan",
  "Can you send me the pricing details?",
  "My payment isn't going through",
  "Do you offer refunds?",
  "What time do you close today?",
  "Can I speak with someone human?",
  "The app keeps crashing on Android",
  "Is there a mobile app available?",
  "I want to cancel my subscription",
  "How do I reset my password?",
  "Can I get a receipt for my payment?",
  "Your service is amazing, thank you!",
  "I've been waiting 3 days for a response",
  "Please help me with the integration",
  "How many channels can I connect?",
  "Is there a free trial available?",
];
const OUT_TEXTS = [
  "Hello! How can I help you today?",
  "I can look into that for you right away.",
  "Thank you for reaching out! Let me check.",
  "Your order is on its way — estimated delivery in 2–3 days.",
  "I've gone ahead and updated your account.",
  "We've processed your refund. It will appear in 3–5 business days.",
  "Our support team is open 9 AM – 6 PM weekdays.",
  "I'm connecting you with a specialist now.",
  "We apologize for the inconvenience. The issue has been fixed.",
  "The free trial includes all features for 7 days, no card needed.",
  "You can connect up to 6 channels on the Grow plan.",
  "I've reset your password — please check your email.",
  "Your receipt has been emailed to you.",
  "Thanks for the kind words! We really appreciate it.",
];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

Deno.serve(async (req: Request) => {
  const cors = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Content-Type":                 "application/json",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST")    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: cors });

  let partnerId: string | undefined;
  try {
    const body = await req.json();
    partnerId = body.partner_id;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: cors });
  }

  if (!partnerId) {
    return new Response(JSON.stringify({ error: "partner_id is required" }), { status: 400, headers: cors });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Build 40 realistic messages spread across the last 30 days
  const rows = [];
  const msgCount = 40;
  for (let i = 0; i < msgCount; i++) {
    const sender  = rand(SENDERS);
    const channel = rand(CHANNELS);
    const isIn    = Math.random() > 0.35; // ~65% inbound
    const daysBack = Math.floor(Math.random() * 30);

    rows.push({
      partner_id:          partnerId,
      channel,
      direction:           isIn ? "inbound" : "outbound",
      sender_id:           sender.id,
      sender_name:         sender.name,
      recipient_id:        isIn ? "bot" : sender.id,
      content:             isIn ? rand(IN_TEXTS) : rand(OUT_TEXTS),
      content_type:        "text",
      external_message_id: `demo_${Date.now()}_${i}`,
      status:              isIn ? "received" : rand(["sent", "delivered", "read"]),
      created_at:          daysAgo(daysBack),
    });
  }

  // Sort chronologically before inserting
  rows.sort((a, b) => a.created_at.localeCompare(b.created_at));

  const { error } = await supabase.from("messages").insert(rows);

  if (error) {
    console.error("Seed error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors });
  }

  return new Response(JSON.stringify({ inserted: rows.length }), { status: 200, headers: cors });
});
