export function buildGeoPrompts(params: {
  brandName: string;
  clientCategory: string;
  location?: string;
}): string[] {
  const { brandName, clientCategory, location } = params;
  const area = location?.trim() || "日本";
  const category = clientCategory.trim() || "サービス";

  return [
    `${area}でおすすめの${category}を教えてください。`,
    `${area}で評判のいい${category}はどこですか？`,
    `${area}の${category}で口コミが良いところを教えてください。`,
    `${area}で${brandName}のような${category}を探しています。`,
    `${category}を選ぶときのポイントと、${area}のおすすめを教えてください。`,
    `${brandName}の評判や特徴を教えてください。`,
  ];
}
