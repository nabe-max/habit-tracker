import type { Metadata } from "next";

import { AlbumLocaleProvider } from "@/components/album/AlbumLocaleProvider";

export const metadata: Metadata = {
  title: "Album Book | Photo albums you can flip like a book",
  description:
    "Place photos freely and flip through your album like a real book. English / 日本語.",
};

export default function AlbumLayout({ children }: { children: React.ReactNode }) {
  return <AlbumLocaleProvider>{children}</AlbumLocaleProvider>;
}
