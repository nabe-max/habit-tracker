-- GEO Lab: 競合を text[] から jsonb オブジェクト配列へ移行
-- 既存DBがある場合、Supabase SQL Editor で実行してください

alter table geo_brands alter column competitors drop default;

alter table geo_brands alter column competitors type jsonb using (
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'trackedName', elem,
          'displayName', elem
        )
      )
      from unnest(competitors) as elem
    ),
    '[]'::jsonb
  )
);

alter table geo_brands alter column competitors set default '[]'::jsonb;
