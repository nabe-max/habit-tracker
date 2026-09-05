// @ts-nocheck
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { createCanvas, loadImage } from "@napi-rs/canvas";

type Region = { x: number; y: number; w: number; h: number };

/** 0–1 の比率で指定 */
function toRegions(
  width: number,
  height: number,
  ratios: Array<{ x: number; y: number; w: number; h: number }>,
): Region[] {
  return ratios.map((r) => ({
    x: Math.round(r.x * width),
    y: Math.round(r.y * height),
    w: Math.round(r.w * width),
    h: Math.round(r.h * height),
  }));
}

function mosaicRegion(
  ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>,
  source: ReturnType<typeof createCanvas>,
  region: Region,
  blockSize = 10,
) {
  const { x, y, w, h } = region;
  if (w <= 0 || h <= 0) return;

  const temp = createCanvas(w, h);
  const tempCtx = temp.getContext("2d");
  const smallW = Math.max(1, Math.floor(w / blockSize));
  const smallH = Math.max(1, Math.floor(h / blockSize));

  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(source as unknown as CanvasImageSource, x, y, w, h, 0, 0, smallW, smallH);
  tempCtx.drawImage(temp as unknown as CanvasImageSource, 0, 0, smallW, smallH, 0, 0, w, h);

  ctx.drawImage(temp as unknown as CanvasImageSource, 0, 0, w, h, x, y, w, h);
}

async function mosaicImage(
  inputPath: string,
  outputPath: string,
  regionRatios: Array<{ x: number; y: number; w: number; h: number }>,
) {
  const image = await loadImage(inputPath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image as unknown as CanvasImageSource, 0, 0);

  const regions = toRegions(image.width, image.height, regionRatios);
  for (const region of regions) {
    mosaicRegion(ctx, canvas, region);
  }

  writeFileSync(outputPath, canvas.toBuffer("image/png"));
  console.log(`Wrote ${outputPath} (${regions.length} regions)`);
}

async function main() {
  const outDir = join(process.cwd(), "public", "lp");
  mkdirSync(outDir, { recursive: true });

  const overviewSource = join(outDir, "overview-source.png");

  await mosaicImage(overviewSource, join(outDir, "overview.png"), [
    { x: 0.04, y: 0.3, w: 0.21, h: 0.07 },
    { x: 0.22, y: 0.075, w: 0.36, h: 0.08 },
    { x: 0.74, y: 0.19, w: 0.24, h: 0.085 },
    { x: 0.22, y: 0.42, w: 0.3, h: 0.06 },
    { x: 0.22, y: 0.78, w: 0.58, h: 0.07 },
    { x: 0.79, y: 0.455, w: 0.2, h: 0.045 },
    { x: 0.79, y: 0.525, w: 0.2, h: 0.04 },
    { x: 0.79, y: 0.585, w: 0.2, h: 0.04 },
    { x: 0.79, y: 0.645, w: 0.2, h: 0.04 },
  ]);

  await mosaicImage(join(outDir, "scan.png"), join(outDir, "scan.png"), [
    { x: 0.24, y: 0.465, w: 0.24, h: 0.038 },
  ]);

  await mosaicImage(join(outDir, "prompts.png"), join(outDir, "prompts.png"), [
    { x: 0.52, y: 0.24, w: 0.45, h: 0.14 },
    { x: 0.52, y: 0.4, w: 0.45, h: 0.14 },
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
