import Link from "next/link";
import { notFound } from "next/navigation";

import { OsakaHeader } from "@/components/osaka/OsakaHeader";
import { PlanDayTabs } from "@/components/osaka/PlanDayTabs";
import { OSAKA_PLANS, getOsakaPlan } from "@/data/osaka/plans";

export function generateStaticParams() {
  return OSAKA_PLANS.map((plan) => ({ slug: plan.slug }));
}

export default async function OsakaPlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plan = getOsakaPlan(slug);
  if (!plan) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <OsakaHeader />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <p className="text-sm font-medium text-orange-600">Base: {plan.baseArea}</p>
          <h1 className="text-2xl font-bold text-slate-900">{plan.name}</h1>
          <p className="mt-2 text-slate-600">{plan.tagline}</p>
          <p className="mt-3 text-sm text-slate-500">
            New here?{" "}
            <Link href="/osaka/prep" className="text-orange-600 hover:underline">
              Complete the prep checklist
            </Link>{" "}
            first.
          </p>
        </div>
        <PlanDayTabs days={plan.days} />
      </main>
    </div>
  );
}
