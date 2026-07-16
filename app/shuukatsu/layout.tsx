import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "企業研究AI | 就活生のための企業分析ツール",
  description:
    "会社名と公式サイトURLを入力するだけで、事業内容・強み・就活ポイント・志望動機のたたき台をAIが自動生成。",
};

export default function ShuukatsuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
