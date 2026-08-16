import type { Metadata } from "next";

import { SleepSoundApp } from "@/components/sleep/SleepSoundApp";

export const metadata: Metadata = {
  title: "Drift | Sleep sounds for deeper rest",
  description:
    "Choose river, wind, rain, and other calming sounds to improve your sleep quality.",
};

export default function SleepPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),_transparent_35%)]" />

      <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <p className="text-lg font-semibold tracking-wide text-white">Drift</p>
            <p className="text-sm text-slate-400">Sleep sounds for deeper rest</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
            Free · No login
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Pick a sound. Fall asleep better.
          </h1>
          <p className="mt-3 text-slate-400">
            River, wind, rain, and more — select an ambient track and let it play all night.
          </p>
        </section>

        <SleepSoundApp />
      </main>
    </div>
  );
}
