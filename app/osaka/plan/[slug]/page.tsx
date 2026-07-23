import { notFound } from "next/navigation";

import { OsakaPlanPageContent } from "@/components/osaka/OsakaPlanPageContent";
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

  return <OsakaPlanPageContent plan={plan} />;
}
