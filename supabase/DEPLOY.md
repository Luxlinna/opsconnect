# Deploying Webhook Edge Functions

## Prerequisites

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
```

## 1. Run the schema migration

Open Supabase Dashboard → SQL Editor, paste and run `supabase-schema.sql`.

## 2. Set secrets for each channel

```bash
# Anthropic — required for AI chat widget
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

# WhatsApp (Meta Business API)
supabase secrets set WHATSAPP_VERIFY_TOKEN=your_secret_token

# Telegram
supabase secrets set TELEGRAM_SECRET_TOKEN=your_secret_token

# Facebook Messenger
supabase secrets set MESSENGER_VERIFY_TOKEN=your_secret_token

# Instagram
supabase secrets set INSTAGRAM_VERIFY_TOKEN=your_secret_token

# LINE
supabase secrets set LINE_CHANNEL_SECRET=your_line_channel_secret

# WeChat
supabase secrets set WECHAT_TOKEN=your_wechat_token
```

## 3. Deploy all functions

```bash
supabase functions deploy webhook-whatsapp
supabase functions deploy webhook-telegram
supabase functions deploy webhook-messenger
supabase functions deploy webhook-instagram
supabase functions deploy webhook-line
supabase functions deploy webhook-wechat
supabase functions deploy chat-support --no-verify-jwt
supabase functions deploy seed-demo-messages
supabase functions deploy ai-chat --no-verify-jwt
```

## 4. Webhook URLs to paste into each platform

| Channel   | Webhook URL                                                                 |
| --------- | --------------------------------------------------------------------------- |
| WhatsApp  | `https://<ref>.supabase.co/functions/v1/webhook-whatsapp`                   |
| Telegram  | `https://<ref>.supabase.co/functions/v1/webhook-telegram?partner_id=<uuid>` |
| Messenger | `https://<ref>.supabase.co/functions/v1/webhook-messenger`                  |
| Instagram | `https://<ref>.supabase.co/functions/v1/webhook-instagram`                  |
| LINE      | `https://<ref>.supabase.co/functions/v1/webhook-line?partner_id=<uuid>`     |
| WeChat    | `https://<ref>.supabase.co/functions/v1/webhook-wechat?partner_id=<uuid>`   |

> For channels that use `partner_id` in the URL (Telegram, LINE, WeChat), find the UUID in the `partners` table in Supabase.
> For channels that resolve it automatically (WhatsApp, Messenger, Instagram), the function looks up `channel_configs` by the account ID sent in the payload.

## 5. Verify messages are being recorded

```sql
select channel, direction, sender_id, content, created_at
from public.messages
order by created_at desc
limit 20;
```

