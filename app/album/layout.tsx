import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Album Book | 写真を本のように残す",
  description:
    "写真を自由な位置・大きさで配置し、本のようにめくって閲覧できるアルバムアプリ。",
};

export default function AlbumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
