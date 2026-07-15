import type { Metadata } from "next";
import { Lora, Noto_Sans_JP } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cafe-serif",
});

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-cafe-sans",
});

export const metadata: Metadata = {
  title: "珈琲屋 木漏れ日 | カフェ予約サイト（Portfolio）",
  description:
    "メニュー・ギャラリー・予約フォーム付きのカフェWebサイト。Portfolio by nabe-max",
};

export default function CafeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${lora.variable} ${notoSans.variable} font-[family-name:var(--font-cafe-sans)]`}
    >
      {children}
    </div>
  );
}
