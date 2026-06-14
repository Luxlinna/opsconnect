/**
 * WeChat Official Account webhook handler.
 *
 * Setup in WeChat Official Account Platform → Development → Basic Configuration:
 *   Server URL:  https://<project-ref>.supabase.co/functions/v1/webhook-wechat?partner_id=<uuid>
 *   Token:       set WECHAT_TOKEN in Supabase Edge Function secrets
 *   EncodingAESKey: optional, set WECHAT_ENCODING_KEY for encrypted messages
 *
 * WeChat sends XML, not JSON.
 */

import { saveMessage, jsonResponse } from "../_shared/save-message.ts";

const WECHAT_TOKEN = Deno.env.get("WECHAT_TOKEN") ?? "";

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const partnerId = url.searchParams.get("partner_id") ?? undefined;

  // ── Webhook verification (GET) ──────────────────────────────────────
  if (req.method === "GET") {
    const signature = url.searchParams.get("signature") ?? "";
    const timestamp = url.searchParams.get("timestamp") ?? "";
    const nonce = url.searchParams.get("nonce") ?? "";
    const echostr = url.searchParams.get("echostr") ?? "";

    if (await verifySignature(signature, timestamp, nonce)) {
      return new Response(echostr, { status: 200, headers: { "Content-Type": "text/plain" } });
    }
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  // Verify signature on POST as well
  const signature = url.searchParams.get("signature") ?? "";
  const timestamp = url.searchParams.get("timestamp") ?? "";
  const nonce = url.searchParams.get("nonce") ?? "";
  if (WECHAT_TOKEN && !(await verifySignature(signature, timestamp, nonce))) {
    return jsonResponse({ error: "Invalid signature" }, 403);
  }

  const xmlBody = await req.text();

  try {
    const msg = parseXml(xmlBody);
    if (!msg) return new Response("success", { status: 200 });

    const msgType = msg.MsgType?.toLowerCase();
    if (msgType === "event") {
      // Subscription / unsubscription events — record but no chat content
      await saveMessage({
        partner_id: partnerId,
        channel: "wechat",
        direction: "inbound",
        sender_id: msg.FromUserName,
        recipient_id: msg.ToUserName,
        content: `[event:${msg.Event}]`,
        content_type: "text",
        external_message_id: msg.MsgId,
        status: "received",
        raw_payload: msg,
      });
    } else {
      await saveMessage({
        partner_id: partnerId,
        channel: "wechat",
        direction: "inbound",
        sender_id: msg.FromUserName,
        recipient_id: msg.ToUserName,
        content: extractContent(msg),
        content_type: detectContentType(msgType ?? "text"),
        media_url: msg.MediaId ? `wechat_media:${msg.MediaId}` : undefined,
        external_message_id: msg.MsgId,
        status: "received",
        raw_payload: msg,
      });
    }
  } catch (err) {
    console.error("WeChat webhook error:", err);
    return new Response("success", { status: 200 }); // WeChat requires "success" response
  }

  // WeChat requires plain "success" text response
  return new Response("success", { status: 200, headers: { "Content-Type": "text/plain" } });
});

async function verifySignature(signature: string, timestamp: string, nonce: string): Promise<boolean> {
  const parts = [WECHAT_TOKEN, timestamp, nonce].sort();
  const str = parts.join("");
  const hashBuffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex === signature;
}

function parseXml(xml: string): Record<string, string> | null {
  const result: Record<string, string> = {};
  const tagPattern = /<(\w+)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/\1>/g;
  let match;
  while ((match = tagPattern.exec(xml)) !== null) {
    result[match[1]] = match[2].trim();
  }
  return Object.keys(result).length ? result : null;
}

function extractContent(msg: Record<string, string>): string | undefined {
  return msg.Content ?? msg.Recognition ?? msg.Title;
}

function detectContentType(type: string): "text" | "image" | "video" | "audio" | "file" | "sticker" | "location" {
  switch (type) {
    case "image":    return "image";
    case "voice":    return "audio";
    case "video":
    case "shortvideo": return "video";
    case "location": return "location";
    case "link":     return "file";
    default:         return "text";
  }
}
