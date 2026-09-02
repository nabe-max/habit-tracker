-- GEO Lab: AIプロンプト提案用テーブル
-- 既存DBがある場合、Supabase SQL Editor で実行してください

create table if not exists geo_prompt_suggestions (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references geo_brands(id) on delete cascade,
  suggested_prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'tracked', 'rejected')),
  created_at timestamptz not null default now(),
  unique (brand_id, suggested_prompt)
);

create index if not exists geo_prompt_suggestions_brand_status_idx
  on geo_prompt_suggestions (brand_id, status, created_at desc);
