import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "副業習慣トラッカー | 本業後の1時間を、習慣にする。",
  description:
    "副業を目指す会社員のための習慣トラッカー。本業後の1時間を習慣化し、ストリークで続ける仕組みを。完全無料。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
