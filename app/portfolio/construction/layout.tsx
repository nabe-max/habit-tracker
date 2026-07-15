import type { Metadata } from "next";
import { Noto_Sans_JP, Oswald } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-corp-display",
});

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-corp-sans",
});

export const metadata: Metadata = {
  title: "株式会社 匠建 | 工務店コーポレートサイト（Portfolio）",
  description:
    "新築・リフォーム・公共施設の施工を手がける工務店のコーポレートサイト。Portfolio by nabe-max",
};

export default function ConstructionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${oswald.variable} ${notoSans.variable} font-[family-name:var(--font-corp-sans)]`}
    >
      {children}
    </div>
  );
}
