import { createClient } from "@supabase/supabase-js";

export type MessageDirection = "inbound" | "outbound";
export type ContentType = "text" | "image" | "video" | "audio" | "file" | "sticker" | "location";
export type MessageStatus = "received" | "sent" | "delivered" | "read" | "failed";

export interface MessageRecord {
  partner_id?: string;
  channel: string;
  direction: MessageDirection;
  sender_id?: string;
  sender_name?: string;
  recipient_id?: string;
  content?: string;
  content_type?: ContentType;
  media_url?: string;
  external_message_id?: string;
  status?: MessageStatus;
  raw_payload: unknown;
}

export function getServiceClient() {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function saveMessage(record: MessageRecord): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase.from("messages").insert({
    partner_id: record.partner_id ?? null,
    channel: record.channel,
    direction: record.direction,
    sender_id: record.sender_id ?? null,
    sender_name: record.sender_name ?? null,
    recipient_id: record.recipient_id ?? null,
    content: record.content ?? null,
    content_type: record.content_type ?? "text",
    media_url: record.media_url ?? null,
    external_message_id: record.external_message_id ?? null,
    status: record.status ?? "received",
    raw_payload: record.raw_payload,
  });
  if (error) {
    // 23505 = unique_violation — message already saved (webhook retry), skip silently
    if (error.code === "23505") return;
    throw new Error(`DB insert failed: ${error.message}`);
  }
}

// Look up which partner owns this channel account ID.
// Returns the partners.id UUID (required by messages.partner_id foreign key).
export async function resolvePartnerId(channel: string, accountId: string): Promise<string | undefined> {
  const supabase = getServiceClient();
  const { data: cfg } = await supabase
    .from("channel_configs")
    .select("partner_id")
    .eq("channel", channel)
    .eq("account_id", accountId)
    .maybeSingle();
  if (!cfg?.partner_id) return undefined;

  // channel_configs.partner_id stores the text "PART-XXXX" value.
  // messages.partner_id is a UUID FK to partners.id, so we must resolve it.
  const { data: partner } = await supabase
    .from("partners")
    .select("id")
    .eq("partner_id", cfg.partner_id)
    .maybeSingle();
  return partner?.id ?? undefined;
}

/**
 * Verify Meta (WhatsApp / Messenger / Instagram) webhook signature.
 * Meta signs the raw request body with HMAC-SHA256 using your app secret.
 * Header: X-Hub-Signature-256: sha256=<hex>
 */
export async function verifyMetaSignature(
  rawBody: string,
  header: string | null,
  appSecret: string
): Promise<boolean> {
  if (!header || !appSecret) return false;
  const expected = header.startsWith("sha256=") ? header.slice(7) : header;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const actual = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison to prevent timing attacks
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) {
    diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
