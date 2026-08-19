import type { GeoIndustry } from "@/lib/geo/types";

const INDUSTRY_LABELS: Record<GeoIndustry, string> = {
  construction: "設備工事・建設",
  beauty: "美容サロン",
  saas: "B2B SaaS",
  restaurant: "飲食店",
  professional: "士業・コンサル",
  general: "一般",
};

export function getIndustryLabel(industry: GeoIndustry): string {
  return INDUSTRY_LABELS[industry];
}

export function buildGeoPrompts(params: {
  industry: GeoIndustry;
  brandName: string;
  location?: string;
}): string[] {
  const { industry, location } = params;
  const area = location?.trim() || "日本";

  const templates: Record<GeoIndustry, string[]> = {
    construction: [
      `${area}で評判のいい設備工事会社を教えてください。`,
      `${area}のエアコン修理・設置でおすすめの業者は？`,
      `オフィスビルの空調メンテナンス業者の選び方とおすすめは？`,
      `${area}で信頼できる電気設備工事会社を探しています。`,
      `設備工事の見積もりを取るときのポイントとおすすめ会社は？`,
    ],
    beauty: [
      `${area}で人気の美容サロンを教えてください。`,
      `${area}のカットが上手い美容院のおすすめは？`,
      `初めての美容院、${area}で評判いいところは？`,
      `${area}でヘッドスパが評判のサロンを教えて。`,
      `${area}の美容室で予約が取りやすいおすすめ店は？`,
    ],
    saas: [
      `日本の中小企業向けでおすすめの業務効率化SaaSは？`,
      `スタートアップ向けのプロジェクト管理ツールのおすすめは？`,
      `B2B SaaSで導入しやすい会計・経費管理ツールは？`,
      `日本企業向けのCRMツールの比較とおすすめは？`,
      `個人開発者が作った便利なSaaSを教えてください。`,
    ],
    restaurant: [
      `${area}でおすすめのカフェを教えてください。`,
      `${area}のランチに人気のお店は？`,
      `${area}でデートにおすすめのレストランは？`,
      `${area}のコスパがいいディナー店を教えて。`,
      `${area}でテイクアウトが美味しいお店は？`,
    ],
    professional: [
      `${area}で評判の税理士事務所を教えてください。`,
      `スタートアップ向けの社労士・弁護士の選び方とおすすめは？`,
      `${area}の中小企業向けコンサル会社のおすすめは？`,
      `IT企業の契約書レビューに強い弁護士は？`,
      `${area}で相続・事業承継に強い専門家を教えて。`,
    ],
    general: [
      `${area}で評判のいい${params.brandName}のようなサービスは？`,
      `${area}でおすすめのサービス・会社を教えてください。`,
      `${params.brandName}に似た代替サービスの比較を教えて。`,
      `${area}で信頼できる業者の選び方とおすすめは？`,
      `口コミで評判のいい${area}のサービスを教えて。`,
    ],
  };

  return templates[industry];
}
