import type { Metadata } from "next";

import { MorningDashboard } from "@/components/morning/MorningDashboard";
import { isMorningConfigured } from "@/lib/morning/env";

export const metadata: Metadata = {
  title: "Morning You | A note from yesterday's you",
  description: "Write a motivation note at night. Wake up to it in your inbox.",
};

export default function MorningPage() {
  const configured = isMorningConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <header className="border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-semibold text-slate-800">Morning You</p>
            <p className="text-sm text-slate-500">Last night&apos;s you → This morning&apos;s email</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {!configured ? (
          <div className="rounded-2xl border border-amber-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            <p className="font-medium text-slate-800">Setup required</p>
            <p className="mt-2">
              Configure Supabase and Resend environment variables. See the{" "}
              <a href="/morning/setup" className="text-amber-700 underline">
                setup guide
              </a>
              .
            </p>
          </div>
        ) : (
          <>
            <section className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Tomorrow morning, a message from yesterday&apos;s you
              </h1>
              <p className="mt-3 text-slate-600">
                Leave yourself one line of motivation at night. Get it in your inbox the next morning.
              </p>
            </section>
            <MorningDashboard />
          </>
        )}
      </main>
    </div>
  );
}
