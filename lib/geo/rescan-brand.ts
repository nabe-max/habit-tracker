import { runGeoScan } from "@/lib/geo/analyzer";
import {
  getGeoBrandById,
  saveGeoScanRun,
  upsertCompetitorSuggestionsFromScan,
} from "@/lib/geo/db";

export async function rescanGeoBrand(brandId: string): Promise<void> {
  const brand = await getGeoBrandById(brandId);
  if (!brand?.is_active) return;

  const result = await runGeoScan(
    {
      brandName: brand.brand_name,
      clientCategory: brand.client_category,
      location: brand.location ?? undefined,
      website: brand.website ?? undefined,
      competitors: brand.competitors ?? [],
    },
    { includeRecommendations: false },
  );

  await saveGeoScanRun(brandId, result);
  await upsertCompetitorSuggestionsFromScan(
    brandId,
    brand.competitors ?? [],
    result.suggestedCompetitors,
  );
}
