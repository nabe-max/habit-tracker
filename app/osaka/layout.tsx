import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Osaka Easy Day | Calm travel guide for first-time visitors",
  description:
    "Free 3-day Osaka plan, prep checklist, and help when you are stuck. Built for foreign tourists — no account required.",
};

export default function OsakaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="en" className="min-h-screen">
      {children}
    </div>
  );
}
