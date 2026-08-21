-- GEO Lab: プロンプト監視用スキーマ
-- Supabase SQL Editor で実行してください

create table if not exists geo_brands (
  id uuid primary key default gen_random_uuid(),
  view_token text not null unique,
  brand_name text not null,
  client_category text not null,
  location text,
  website text,
  competitors text[] not null default '{}',
  is_active boolean not null default true,
  last_scanned_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists geo_scan_runs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references geo_brands(id) on delete cascade,
  visibility_score int not null,
  position_score numeric,
  mention_count int not null,
  total_prompts int not null,
  recommendations jsonb not null default '[]',
  competitor_scores jsonb not null default '[]',
  position_rankings jsonb not null default '[]',
  scanned_at timestamptz not null default now(),
  status text not null default 'completed' check (status in ('completed', 'failed')),
  error_message text
);

create table if not exists geo_prompt_results (
  id uuid primary key default gen_random_uuid(),
  scan_run_id uuid not null references geo_scan_runs(id) on delete cascade,
  prompt text not null,
  mentioned boolean not null,
  competitors_mentioned text[] not null default '{}',
  excerpt text not null default '',
  sentiment text not null check (sentiment in ('positive', 'neutral', 'negative', 'none')),
  position int,
  rankings jsonb not null default '[]'
);

create index if not exists geo_scan_runs_brand_scanned_idx
  on geo_scan_runs (brand_id, scanned_at desc);

create index if not exists geo_brands_active_idx
  on geo_brands (is_active)
  where is_active = true;

create index if not exists geo_brands_due_scan_idx
  on geo_brands (last_scanned_at)
  where is_active = true;
