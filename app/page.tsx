import type { Metadata } from "next";

import { GeoLandingPage } from "@/components/lp/GeoLandingPage";

export const metadata: Metadata = {
  title: "GEO Lab | マーケティング向け AI検索分析",
  description:
    "AI検索で競合よりも優位性を得よう。ChatGPT等の回答可視性を分析。β版・最大3クライアント無料。",
  openGraph: {
    title: "GEO Lab | マーケティング向け AI検索分析",
    description: "AI検索で競合よりも優位性を得よう。",
  },
};

export default function HomePage() {
  return <GeoLandingPage />;
}
