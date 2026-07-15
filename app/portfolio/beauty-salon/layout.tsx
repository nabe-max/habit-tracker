import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-salon-serif",
});

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-salon-sans",
});

export const metadata: Metadata = {
  title: "LUXE hair studio | 美容室 LP（Portfolio）",
  description:
    "上質な空間で、あなたらしい美しさを。カット・カラー・トリートメントの美容室ランディングページ。",
};

export default function SalonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${cormorant.variable} ${notoSans.variable} font-[family-name:var(--font-salon-sans)]`}
    >
      {children}
    </div>
  );
}
