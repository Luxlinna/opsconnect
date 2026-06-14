/**
 * WhatsApp Cloud API webhook handler.
 *
 * Setup in Meta Developer Console:
 *   Webhook URL:    https://<project-ref>.supabase.co/functions/v1/webhook-whatsapp
 *   Verify Token:   set WHATSAPP_VERIFY_TOKEN in Supabase Edge Function secrets
 *   Subscribe to:   messages
 *
 * Secrets required:
 *   WHATSAPP_VERIFY_TOKEN  – token you enter in Meta's webhook configuration
 *   WHATSAPP_APP_SECRET    – Meta app secret (used to verify X-Hub-Signature-256)
 */

import { saveMessage, resolvePartnerId, verifyMetaSignature, jsonResponse } from "../_shared/save-message.ts";

const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") ?? "";
const APP_SECRET   = Deno.env.get("WHATSAPP_APP_SECRET")   ?? "";

Deno.serve(async (req: Request) => {
  // ── Webhook verification (GET) ──────────────────────────────────────
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode      = url.searchParams.get("hub.mode");
    const token     = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
      return new Response(challenge, { status: 200 });
    }
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  // Read raw body first — needed for signature verification before JSON parsing
  const rawBody = await req.text();

  if (APP_SECRET) {
    const sig = req.headers.get("x-hub-signature-256");
    if (!(await verifyMetaSignature(rawBody, sig, APP_SECRET))) {
      return jsonResponse({ error: "Invalid signature" }, 403);
    }
  }

  let body!: WhatsAppPayload;
  try {
    body = JSON.parse(rawBody) as WhatsAppPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  try {
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value        = change.value;
        const phoneNumberId = value?.metadata?.phone_number_id;

        for (const msg of value?.messages ?? []) {
          const partnerId = phoneNumberId
            ? await resolvePartnerId("whatsapp", phoneNumberId)
            : undefined;

          const content = extractContent(msg);

          await saveMessage({
            partner_id:          partnerId,
            channel:             "whatsapp",
            direction:           "inbound",
            sender_id:           msg.from,
            sender_name:         value.contacts?.find((c: { wa_id: string }) => c.wa_id === msg.from)?.profile?.name,
            recipient_id:        phoneNumberId,
            content:             content.text,
            content_type:        content.type,
            media_url:           content.mediaUrl,
            external_message_id: msg.id,
            status:              "received",
            raw_payload:         body,
          });
        }

        // Delivery / read / failed status updates
        for (const statusUpdate of value?.statuses ?? []) {
          const partnerId = phoneNumberId
            ? await resolvePartnerId("whatsapp", phoneNumberId)
            : undefined;

          const newStatus =
            statusUpdate.status === "delivered" ? "delivered"
            : statusUpdate.status === "read"      ? "read"
            : statusUpdate.status === "failed"    ? "failed"
            : "sent";

          const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
          const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
            { auth: { persistSession: false } }
          );
          await supabase
            .from("messages")
            .update({ status: newStatus })
            .eq("external_message_id", statusUpdate.id)
            .eq("channel", "whatsapp")
            .eq("partner_id", partnerId ?? "");
        }
      }
    }
  } catch (err) {
    console.error("WhatsApp webhook error:", err);
    return jsonResponse({ error: "Internal error" }, 500);
  }

  return jsonResponse({ ok: true });
});

function extractContent(msg: WhatsAppMessage): {
  text?: string;
  type: "text" | "image" | "video" | "audio" | "file" | "sticker" | "location";
  mediaUrl?: string;
} {
  switch (msg.type) {
    case "text":     return { type: "text",     text: msg.text?.body };
    case "image":    return { type: "image",    mediaUrl: msg.image?.id };
    case "video":    return { type: "video",    mediaUrl: msg.video?.id };
    case "audio":    return { type: "audio",    mediaUrl: msg.audio?.id };
    case "document": return { type: "file",     mediaUrl: msg.document?.id, text: msg.document?.filename };
    case "sticker":  return { type: "sticker",  mediaUrl: msg.sticker?.id };
    case "location": return { type: "location", text: `${msg.location?.latitude},${msg.location?.longitude}` };
    default:         return { type: "text",     text: `[${msg.type}]` };
  }
}

// ── Types ───────────────────────────────────────────────────────────────
interface WhatsAppPayload {
  object: string;
  entry: Array<{
    changes: Array<{
      value: {
        metadata: { phone_number_id: string };
        messages?: WhatsAppMessage[];
        contacts?: Array<{ wa_id: string; profile: { name: string } }>;
        statuses?: Array<{ id: string; status: string; recipient_id: string }>;
      };
    }>;
  }>;
}

interface WhatsAppMessage {
  id: string;
  from: string;
  type: string;
  text?:     { body: string };
  image?:    { id: string };
  video?:    { id: string };
  audio?:    { id: string };
  document?: { id: string; filename: string };
  sticker?:  { id: string };
  location?: { latitude: number; longitude: number };
}
