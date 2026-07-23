import type { Metadata } from "next";

import { OsakaLocaleProvider } from "@/components/osaka/OsakaLocaleProvider";

export const metadata: Metadata = {
  title: "Osaka Easy Day | Calm travel guide for first-time visitors",
  description:
    "Free 3-day Osaka plan, prep checklist, and help when you are stuck. English / 日本語 — no account required.",
};

export default function OsakaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OsakaLocaleProvider>
      <div className="min-h-screen">{children}</div>
    </OsakaLocaleProvider>
  );
}
