-- Morning You MVP schema (run in Supabase SQL editor)

create table if not exists morning_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  timezone text not null default 'Asia/Tokyo',
  morning_hour int not null default 7 check (morning_hour >= 0 and morning_hour <= 23),
  morning_minute int not null default 0 check (morning_minute >= 0 and morning_minute <= 59),
  created_at timestamptz not null default now()
);

create table if not exists morning_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references morning_users(id) on delete cascade,
  body text not null check (char_length(body) >= 1 and char_length(body) <= 500),
  deliver_at timestamptz not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists morning_messages_pending_idx
  on morning_messages (deliver_at)
  where sent_at is null;

create table if not exists morning_auth_tokens (
  token text primary key,
  email text not null,
  expires_at timestamptz not null
);

create index if not exists morning_auth_tokens_expires_idx
  on morning_auth_tokens (expires_at);
