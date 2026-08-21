-- GEO Lab: Position 計測用カラム追加
-- 既存DBがある場合、Supabase SQL Editor で実行してください

alter table geo_scan_runs
  add column if not exists position_score numeric,
  add column if not exists position_rankings jsonb not null default '[]';

alter table geo_prompt_results
  add column if not exists position int,
  add column if not exists rankings jsonb not null default '[]';
