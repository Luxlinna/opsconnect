-- Run this in Supabase Dashboard → SQL Editor
-- Safe to run on your existing schema.

-- 1. Add auth link + email to partners (safe if already exists)
alter table public.partners
  add column if not exists user_id             uuid references auth.users(id) on delete cascade,
  add column if not exists email               text,
  add column if not exists ai_business_context text;  -- free-text fed to the AI chat widget

-- ─────────────────────────────────────────────
-- MESSAGES TABLE
-- Stores every inbound/outbound message from all connected channels.
-- Populated by Supabase Edge Function webhook handlers.
-- ─────────────────────────────────────────────
create table if not exists public.messages (
  id                  uuid        default gen_random_uuid() primary key,
  partner_id          uuid        references public.partners(id) on delete cascade,
  channel             text        not null,  -- 'whatsapp' | 'telegram' | 'messenger' | 'instagram' | 'line' | 'wechat' | 'email' | 'livechat'
  direction           text        not null check (direction in ('inbound', 'outbound')),
  sender_id           text,                  -- platform user ID of the sender
  sender_name         text,                  -- display name if available
  recipient_id        text,                  -- platform user ID of the recipient
  content             text,                  -- message body text
  content_type        text        not null default 'text',  -- 'text' | 'image' | 'video' | 'audio' | 'file' | 'sticker' | 'location'
  media_url           text,                  -- URL to media attachment if any
  external_message_id text,                  -- message ID from the originating platform
  status              text        not null default 'received' check (status in ('received', 'sent', 'delivered', 'read', 'failed')),
  raw_payload         jsonb,                 -- full webhook payload for debugging / replay
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Fast lookup by partner + channel + time (inbox view)
create index if not exists messages_partner_channel_idx on public.messages (partner_id, channel, created_at desc);
-- Fast lookup by sender (contact timeline)
create index if not exists messages_sender_idx          on public.messages (sender_id, created_at desc);
-- Dedup: unique per channel + platform message ID (partial — excludes live chat which has no external ID)
create unique index if not exists messages_dedup_idx on public.messages (channel, external_message_id)
  where external_message_id is not null;

-- Keep updated_at current automatically
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists messages_updated_at on public.messages;
create trigger messages_updated_at
  before update on public.messages
  for each row execute function public.set_updated_at();

-- RLS: enabled, service-role key (used by Edge Functions) bypasses it
alter table public.messages enable row level security;

drop policy if exists "Partners read own messages" on public.messages;
drop policy if exists "Service role insert messages" on public.messages;

-- Authenticated partners can read their own messages
create policy "Partners read own messages"
  on public.messages for select
  using (
    partner_id in (
      select id from public.partners where user_id = auth.uid()
    )
  );

-- Edge Functions use service_role key → bypasses RLS (no insert policy needed)

-- 2. Enable RLS on all tables
alter table public.partners       enable row level security;
alter table public.channel_configs enable row level security;
alter table public.team_members   enable row level security;
alter table public.conversations  enable row level security;

-- 3. Partners policies
drop policy if exists "Public read partners"      on public.partners;
drop policy if exists "Users insert own partner"  on public.partners;
drop policy if exists "Users update own partner"  on public.partners;

create policy "Public read partners"
  on public.partners for select using (true);

create policy "Users insert own partner"
  on public.partners for insert with check (true);

create policy "Users update own partner"
  on public.partners for update using (auth.uid() = user_id);

-- 4. Channel configs policies
drop policy if exists "Public read channel_configs"  on public.channel_configs;
drop policy if exists "Users manage channel_configs" on public.channel_configs;

create policy "Public read channel_configs"
  on public.channel_configs for select using (true);

create policy "Users manage channel_configs"
  on public.channel_configs for all using (true);

-- ─────────────────────────────────────────────
-- SUPPORT REQUESTS TABLE
-- Stores visitor info collected by the embedded chat widget.
-- Populated by the chat-support Edge Function.
-- partner_id stores the readable "PART-XXXX-XXXX" value from partners.partner_id.
-- ─────────────────────────────────────────────
create table if not exists public.support_requests (
  id              uuid        default gen_random_uuid() primary key,
  partner_id      text,                 -- matches partners.partner_id (e.g. "PART-XXXX-XXXX")
  visitor_name    text        not null,
  visitor_contact text        not null, -- email or phone entered by visitor
  company         text,                 -- company name (optional)
  topic           text,                 -- support topic / category (optional)
  message         text        not null,
  status          text        not null default 'new' check (status in ('new', 'read', 'resolved')),
  created_at      timestamptz not null default now()
);

create index if not exists support_requests_partner_idx
  on public.support_requests (partner_id, created_at desc);

alter table public.support_requests enable row level security;

drop policy if exists "Partners read own support requests"   on public.support_requests;
drop policy if exists "Partners update own support requests" on public.support_requests;

-- Authenticated partners can read and update their own support requests
create policy "Partners read own support requests"
  on public.support_requests for select
  using (
    partner_id in (
      select partner_id from public.partners where user_id = auth.uid()
    )
  );

create policy "Partners update own support requests"
  on public.support_requests for update
  using (
    partner_id in (
      select partner_id from public.partners where user_id = auth.uid()
    )
  );

-- Edge Functions insert via service_role key → bypasses RLS
