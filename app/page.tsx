import type { Metadata } from "next";

import { GeoLandingPage } from "@/components/lp/GeoLandingPage";

export const metadata: Metadata = {
  title: "GEO Lab | 代理店向け AI検索可視化ツール",
  description:
    "ChatGPTの回答でクライアントが何位に出るかを可視化。SEO・Web集客代行の代理店向け。β版・最大3クライアント無料。",
  openGraph: {
    title: "GEO Lab | 代理店向け AI検索可視化",
    description:
      "クライアントのAI検索可視性を毎日モニタリング。SEO代理店向けダッシュボード。",
  },
};

export default function HomePage() {
  return <GeoLandingPage />;
}
