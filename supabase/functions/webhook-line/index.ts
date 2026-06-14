/**
 * LINE Messaging API webhook handler.
 *
 * Setup in LINE Developers Console → Messaging API → Webhook settings:
 *   Webhook URL:   https://<project-ref>.supabase.co/functions/v1/webhook-line?partner_id=<uuid>
 *   Set LINE_CHANNEL_SECRET in Supabase Edge Function secrets (used to verify HMAC signature).
 */

import { saveMessage, jsonResponse } from "../_shared/save-message.ts";

const CHANNEL_SECRET = Deno.env.get("LINE_CHANNEL_SECRET") ?? "";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const partnerId = new URL(req.url).searchParams.get("partner_id") ?? undefined;
  const rawBody = await req.text();

  // Verify HMAC-SHA256 signature
  if (CHANNEL_SECRET) {
    const signature = req.headers.get("x-line-signature");
    if (!signature || !(await verifySignature(rawBody, signature, CHANNEL_SECRET))) {
      return jsonResponse({ error: "Invalid signature" }, 403);
    }
  }

  let body!: LinePayload;
  try {
    body = JSON.parse(rawBody) as LinePayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  try {
    for (const event of body.events ?? []) {
      if (event.type !== "message") continue;

      const msg = event.message;
      const userId = event.source.userId ?? event.source.groupId ?? event.source.roomId;

      await saveMessage({
        partner_id: partnerId,
        channel: "line",
        direction: "inbound",
        sender_id: userId,
        recipient_id: body.destination,
        content: extractContent(msg),
        content_type: detectContentType(msg.type),
        external_message_id: msg.id,
        status: "received",
        raw_payload: body,
      });
    }
  } catch (err) {
    console.error("LINE webhook error:", err);
    return jsonResponse({ error: "Internal error" }, 500);
  }

  return jsonResponse({ ok: true });
});

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return signature === expected;
}

function extractContent(msg: LineMessage): string | undefined {
  if (msg.type === "text") return msg.text;
  if (msg.type === "location") return `${msg.address ?? ""} (${msg.latitude},${msg.longitude})`;
  return undefined;
}

function detectContentType(type: string): "text" | "image" | "video" | "audio" | "file" | "sticker" | "location" {
  switch (type) {
    case "image":    return "image";
    case "video":    return "video";
    case "audio":    return "audio";
    case "file":     return "file";
    case "sticker":  return "sticker";
    case "location": return "location";
    default:         return "text";
  }
}

// ── Types ───────────────────────────────────────────────────────────────
interface LinePayload {
  destination: string;
  events: LineEvent[];
}

interface LineEvent {
  type: string;
  replyToken?: string;
  source: { type: string; userId?: string; groupId?: string; roomId?: string };
  timestamp: number;
  message: LineMessage;
}

interface LineMessage {
  id: string;
  type: string;
  text?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}
