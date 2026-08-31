-- GEO Lab: カスタムプロンプト列
-- Supabase SQL Editor で実行してください

alter table geo_brands
  add column if not exists custom_prompts text[] not null default '{}';
