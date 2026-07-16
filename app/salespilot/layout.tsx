import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SalesPilot AI | Web制作営業をAIで効率化",
  description:
    "URLを入力するだけでAIがサイト診断・営業メール作成・案件管理まで。Web制作営業を効率化するSaaS。",
};

export default function SalesPilotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
