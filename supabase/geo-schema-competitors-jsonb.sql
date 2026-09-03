-- GEO Lab: 競合を text[] から jsonb オブジェクト配列へ移行
-- 既存DBがある場合、Supabase SQL Editor で順番に実行してください
-- ※ ALTER ... USING 内ではサブクエリが使えないため、列の追加→UPDATE→入れ替えで移行します

-- 1) 新しい jsonb 列を追加
alter table geo_brands
  add column if not exists competitors_new jsonb not null default '[]'::jsonb;

-- 2) 旧 text[] からデータをコピー
update geo_brands
set competitors_new = coalesce(
  (
    select jsonb_agg(
      jsonb_build_object(
        'trackedName', elem,
        'displayName', elem
      )
    )
    from unnest(competitors::text[]) as elem
  ),
  '[]'::jsonb
);

-- 3) 旧列を削除してリネーム
alter table geo_brands drop column competitors;
alter table geo_brands rename column competitors_new to competitors;
alter table geo_brands alter column competitors set default '[]'::jsonb;
