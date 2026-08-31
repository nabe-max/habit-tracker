import { runGeoScan } from "@/lib/geo/analyzer";
import {
  getCompetitorsState,
  getGeoBrandById,
  saveGeoScanRun,
  upsertCompetitorSuggestionsFromScan,
} from "@/lib/geo/db";

async function main() {
  const brandId = process.argv[2] ?? "367d1502-ef61-47b3-893c-c12f9c69f682";
  const brand = await getGeoBrandById(brandId);
  if (!brand) throw new Error(`Brand not found: ${brandId}`);

  const result = await runGeoScan({
    brandName: brand.brand_name,
    clientCategory: brand.client_category,
    location: brand.location ?? undefined,
    website: brand.website ?? undefined,
    competitors: brand.competitors ?? [],
  });

  console.log("visibility:", result.visibilityScore);
  console.log("mentioned:", result.mentionCount);
  console.log("position rankings:", result.positionRankings);
  console.log("scan suggestions:", result.suggestedCompetitors);

  await saveGeoScanRun(brandId, result);
  await upsertCompetitorSuggestionsFromScan(
    brandId,
    brand.competitors ?? [],
    result.suggestedCompetitors,
  );

  const state = await getCompetitorsState(brandId);
  console.log("db suggestions:", JSON.stringify(state, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
