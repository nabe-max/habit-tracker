import { runGeoScan } from "@/lib/geo/analyzer";
import {
  getGeoBrandById,
  saveGeoScanRun,
  upsertCompetitorSuggestionsFromScan,
} from "@/lib/geo/db";

export async function rescanGeoBrand(brandId: string): Promise<void> {
  const brand = await getGeoBrandById(brandId);
  if (!brand?.is_active) return;

  const activePrompts = brand.custom_prompts ?? [];
  if (activePrompts.length === 0) return;

  const competitors = brand.competitors ?? [];

  const result = await runGeoScan(
    {
      brandName: brand.brand_name,
      clientCategory: brand.client_category,
      location: brand.location ?? undefined,
      website: brand.website ?? undefined,
      customPrompts: activePrompts,
    },
    { includeRecommendations: false, competitors },
  );

  await saveGeoScanRun(brandId, result);
  await upsertCompetitorSuggestionsFromScan(brandId, competitors, result.suggestedCompetitors);
}
