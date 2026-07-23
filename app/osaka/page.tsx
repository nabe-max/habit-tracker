import Link from "next/link";
import { ArrowRight, LifeBuoy, Luggage, Map } from "lucide-react";

import { OsakaHeader } from "@/components/osaka/OsakaHeader";
import { Button } from "@/components/ui/button";

export default function OsakaHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <OsakaHeader />
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white/90 px-6 py-10 shadow-lg shadow-orange-100/50 sm:px-8">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-orange-200/40 blur-2xl" />
          <div className="relative space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
              🇯🇵 Built in Osaka, Japan · Build in Public
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Osaka without the{" "}
              <span className="bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent">
                &quot;what do I do now?&quot;
              </span>{" "}
              panic.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600">
              A simple guide for first-time visitors: a ready-made 3-day plan,
              before-you-go checklist, and help when you are stuck on trains,
              food, or finding your hotel.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Link href="/osaka/plan/classic-3day">
                  Start 3-day plan
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-orange-200">
                <Link href="/osaka/help">I need help now</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/osaka/plan/classic-3day",
              icon: Map,
              title: "3-Day Plan",
              desc: "Namba base · food, castle, local streets",
            },
            {
              href: "/osaka/prep",
              icon: Luggage,
              title: "Before You Go",
              desc: "eSIM, IC card, cash, offline maps",
            },
            {
              href: "/osaka/help",
              icon: LifeBuoy,
              title: "Stuck? Help",
              desc: "Trains, allergies, lost, emergencies",
            },
          ].map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <Icon className="size-6 text-orange-500" />
              <h2 className="mt-3 font-semibold text-slate-800">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{desc}</p>
            </Link>
          ))}
        </section>

        <footer className="border-t border-orange-100 pt-8 text-center text-sm text-slate-500">
          <p>
            Free MVP · No login · Always double-check trains and hours on official
            sites.
          </p>
          <p className="mt-2">
            Feedback welcome on X — shipping in public from Japan.
          </p>
        </footer>
      </main>
    </div>
  );
}
