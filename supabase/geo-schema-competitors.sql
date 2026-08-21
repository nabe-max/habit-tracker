-- GEO Lab: 競合自動提案用テーブル
-- 既存DBがある場合、Supabase SQL Editor で実行してください

create table if not exists geo_competitor_suggestions (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references geo_brands(id) on delete cascade,
  suggested_name text not null,
  mention_count int not null default 0,
  status text not null default 'pending' check (status in ('pending', 'tracked', 'rejected')),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (brand_id, suggested_name)
);

create index if not exists geo_competitor_suggestions_brand_status_idx
  on geo_competitor_suggestions (brand_id, status, mention_count desc);
