/**
 * Telegram Bot webhook handler.
 *
 * Setup via BotFather / Telegram Bot API:
 *   setWebhook URL: https://<project-ref>.supabase.co/functions/v1/webhook-telegram?partner_id=<uuid>
 *   Secret header:  set TELEGRAM_SECRET_TOKEN in Supabase Edge Function secrets,
 *                   then pass it as X-Telegram-Bot-Api-Secret-Token when calling setWebhook.
 */

import { saveMessage, jsonResponse } from "../_shared/save-message.ts";

const SECRET_TOKEN = Deno.env.get("TELEGRAM_SECRET_TOKEN") ?? "";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  // Validate secret token header (prevents spoofed requests)
  if (SECRET_TOKEN) {
    const header = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (header !== SECRET_TOKEN) return jsonResponse({ error: "Forbidden" }, 403);
  }

  // partner_id passed as query param when registering the webhook URL
  const partnerId = new URL(req.url).searchParams.get("partner_id") ?? undefined;

  let body!: TelegramUpdate;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  try {
    const msg = body.message ?? body.edited_message ?? body.channel_post;
    if (msg) {
      await saveMessage({
        partner_id: partnerId,
        channel: "telegram",
        direction: "inbound",
        sender_id: String(msg.from?.id ?? msg.chat.id),
        sender_name: msg.from
          ? [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ")
          : msg.chat.title,
        recipient_id: String(msg.chat.id),
        content: extractText(msg),
        content_type: detectContentType(msg),
        media_url: extractMediaId(msg),
        external_message_id: String(msg.message_id),
        status: "received",
        raw_payload: body,
      });
    }
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return jsonResponse({ error: "Internal error" }, 500);
  }

  // Telegram requires a 200 OK response immediately
  return jsonResponse({ ok: true });
});

function extractText(msg: TelegramMessage): string | undefined {
  return msg.text ?? msg.caption;
}

function detectContentType(msg: TelegramMessage): "text" | "image" | "video" | "audio" | "file" | "sticker" | "location" {
  if (msg.photo)    return "image";
  if (msg.video)    return "video";
  if (msg.voice || msg.audio) return "audio";
  if (msg.document) return "file";
  if (msg.sticker)  return "sticker";
  if (msg.location) return "location";
  return "text";
}

function extractMediaId(msg: TelegramMessage): string | undefined {
  const photo = msg.photo?.[msg.photo.length - 1]; // largest size
  return photo?.file_id ?? msg.video?.file_id ?? msg.voice?.file_id
    ?? msg.audio?.file_id ?? msg.document?.file_id ?? msg.sticker?.file_id;
}

// ── Types ───────────────────────────────────────────────────────────────
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
}

interface TelegramMessage {
  message_id: number;
  from?: { id: number; first_name: string; last_name?: string; username?: string };
  chat: { id: number; title?: string; type: string };
  date: number;
  text?: string;
  caption?: string;
  photo?: Array<{ file_id: string; width: number; height: number }>;
  video?: { file_id: string };
  voice?: { file_id: string };
  audio?: { file_id: string };
  document?: { file_id: string; file_name?: string };
  sticker?: { file_id: string };
  location?: { latitude: number; longitude: number };
}
