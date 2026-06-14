/**
 * Facebook Messenger webhook handler (Meta Graph API).
 *
 * Setup in Meta Developer Console → Messenger → Webhooks:
 *   Webhook URL:   https://<project-ref>.supabase.co/functions/v1/webhook-messenger
 *   Verify Token:  set MESSENGER_VERIFY_TOKEN in Supabase Edge Function secrets
 *   Subscribe to:  messages, messaging_postbacks, message_deliveries, message_reads
 *
 * Secrets required:
 *   MESSENGER_VERIFY_TOKEN  – token you enter in Meta's webhook configuration
 *   MESSENGER_APP_SECRET    – Meta app secret (used to verify X-Hub-Signature-256)
 */

import { saveMessage, resolvePartnerId, verifyMetaSignature, jsonResponse } from "../_shared/save-message.ts";

const VERIFY_TOKEN = Deno.env.get("MESSENGER_VERIFY_TOKEN") ?? "";
const APP_SECRET   = Deno.env.get("MESSENGER_APP_SECRET")   ?? "";

Deno.serve(async (req: Request) => {
  // ── Webhook verification (GET) ──────────────────────────────────────
  if (req.method === "GET") {
    const url       = new URL(req.url);
    const mode      = url.searchParams.get("hub.mode");
    const token     = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
      return new Response(challenge, { status: 200 });
    }
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const rawBody = await req.text();

  if (APP_SECRET) {
    const sig = req.headers.get("x-hub-signature-256");
    if (!(await verifyMetaSignature(rawBody, sig, APP_SECRET))) {
      return jsonResponse({ error: "Invalid signature" }, 403);
    }
  }

  let body!: MessengerPayload;
  try {
    body = JSON.parse(rawBody) as MessengerPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  if (body.object !== "page") return jsonResponse({ ok: true });

  try {
    for (const entry of body.entry ?? []) {
      const pageId    = entry.id;
      const partnerId = await resolvePartnerId("messenger", pageId);

      for (const event of entry.messaging ?? []) {
        if (event.message) {
          const msg    = event.message;
          const isEcho = msg.is_echo;

          await saveMessage({
            partner_id:          partnerId,
            channel:             "messenger",
            direction:           isEcho ? "outbound" : "inbound",
            sender_id:           isEcho ? event.recipient.id : event.sender.id,
            recipient_id:        isEcho ? event.sender.id    : event.recipient.id,
            content:             msg.text,
            content_type:        msg.attachments?.[0]
                                   ? detectAttachmentType(msg.attachments[0].type)
                                   : "text",
            media_url:           msg.attachments?.[0]?.payload?.url,
            external_message_id: msg.mid,
            status:              isEcho ? "sent" : "received",
            raw_payload:         body,
          });
        }

        // Delivery / read receipts — update existing message status
        if (event.delivery || event.read) {
          const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
          const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
            { auth: { persistSession: false } }
          );
          const newStatus  = event.read ? "read" : "delivered";
          const watermark  = event.delivery?.watermark ?? event.read?.watermark;
          if (watermark) {
            await supabase
              .from("messages")
              .update({ status: newStatus })
              .eq("channel", "messenger")
              .eq("partner_id", partnerId ?? "")
              .lte("created_at", new Date(watermark).toISOString());
          }
        }
      }
    }
  } catch (err) {
    console.error("Messenger webhook error:", err);
    return jsonResponse({ error: "Internal error" }, 500);
  }

  return jsonResponse({ ok: true });
});

function detectAttachmentType(type: string): "image" | "video" | "audio" | "file" | "location" | "text" {
  switch (type) {
    case "image":    return "image";
    case "video":    return "video";
    case "audio":    return "audio";
    case "file":     return "file";
    case "location": return "location";
    default:         return "file";
  }
}

// ── Types ───────────────────────────────────────────────────────────────
interface MessengerPayload {
  object: string;
  entry: Array<{
    id: string;
    messaging: Array<{
      sender:    { id: string };
      recipient: { id: string };
      timestamp: number;
      message?: {
        mid:          string;
        text?:        string;
        is_echo?:     boolean;
        attachments?: Array<{ type: string; payload: { url?: string } }>;
      };
      delivery?: { watermark: number };
      read?:     { watermark: number };
    }>;
  }>;
}
