/**
 * Instagram Messaging webhook handler (Meta Graph API).
 *
 * Setup in Meta Developer Console → Instagram → Webhooks:
 *   Webhook URL:   https://<project-ref>.supabase.co/functions/v1/webhook-instagram
 *   Verify Token:  set INSTAGRAM_VERIFY_TOKEN in Supabase Edge Function secrets
 *   Subscribe to:  messages
 *
 * Secrets required:
 *   INSTAGRAM_VERIFY_TOKEN  – token you enter in Meta's webhook configuration
 *   INSTAGRAM_APP_SECRET    – Meta app secret (used to verify X-Hub-Signature-256)
 *
 * Note: requires Instagram Professional account linked to a Facebook Page,
 *       with "Instagram Messaging" permission approved in your Meta app.
 */

import { saveMessage, resolvePartnerId, verifyMetaSignature, jsonResponse } from "../_shared/save-message.ts";

const VERIFY_TOKEN = Deno.env.get("INSTAGRAM_VERIFY_TOKEN") ?? "";
const APP_SECRET   = Deno.env.get("INSTAGRAM_APP_SECRET")   ?? "";

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

  let body!: InstagramPayload;
  try {
    body = JSON.parse(rawBody) as InstagramPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  if (body.object !== "instagram") return jsonResponse({ ok: true });

  try {
    for (const entry of body.entry ?? []) {
      const igAccountId = entry.id;
      const partnerId   = await resolvePartnerId("instagram", igAccountId);

      for (const event of entry.messaging ?? []) {
        // Regular DM
        if (event.message) {
          const msg    = event.message;
          const isEcho = msg.is_echo;

          await saveMessage({
            partner_id:          partnerId,
            channel:             "instagram",
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

        // Story reply — sender replied to your story
        if (event.message?.reply_to?.story) {
          // Already captured above; story context is in raw_payload
        }

        // Reaction (like/heart on a message)
        if (event.reaction) {
          await saveMessage({
            partner_id:          partnerId,
            channel:             "instagram",
            direction:           "inbound",
            sender_id:           event.sender.id,
            recipient_id:        event.recipient.id,
            content:             `[reaction:${event.reaction.reaction}]`,
            content_type:        "text",
            external_message_id: event.reaction.mid,
            status:              "received",
            raw_payload:         body,
          });
        }
      }
    }
  } catch (err) {
    console.error("Instagram webhook error:", err);
    return jsonResponse({ error: "Internal error" }, 500);
  }

  return jsonResponse({ ok: true });
});

function detectAttachmentType(type: string): "image" | "video" | "audio" | "file" | "text" {
  switch (type) {
    case "image":  return "image";
    case "video":  return "video";
    case "audio":  return "audio";
    case "share":  return "file";
    default:       return "file";
  }
}

// ── Types ───────────────────────────────────────────────────────────────
interface InstagramPayload {
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
        reply_to?:    { story?: { url: string; id: string } };
      };
      reaction?: {
        mid:      string;
        action:   string;
        reaction: string;
      };
    }>;
  }>;
}
