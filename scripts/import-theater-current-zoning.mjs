#!/usr/bin/env node
// Builds public/zoning/theater-current-zoning.geojson — the 1,232 historical
// NYC theater sites screened against present-day zoning, from the
// nyc_historical_theaters_current_zoning_2026 package (NYC DCP GIS Zoning
// Features, July 2026; rules ZR 32-181, 32-183, 42-181). Trims the source
// properties down to what the map layer and its detail popup actually use.
//
// Re-run after updating the source package:
//   node scripts/import-theater-current-zoning.mjs <path-to-source-geojson>

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_PATH =
  process.argv[2] ??
  "/Users/gibson/Documents/Codex/2026-09-15/thr/outputs/nyc_historical_theaters_current_zoning_2026.geojson";
const OUT_PATH = path.join(ROOT, "public/zoning/theater-current-zoning.geojson");

/** Matches the four categories in current_theater_classification_rules_2026.csv. */
const CLASSIFICATION_TO_CODE = {
  "Theater permitted today": "permitted",
  "Theater permitted with restrictions": "restricted",
  "Special approval required": "special",
  "Theater not permitted": "not_permitted",
};

function main() {
  const source = JSON.parse(readFileSync(SOURCE_PATH, "utf8"));

  const features = source.features.map((f) => {
    const p = f.properties;
    const classification = CLASSIFICATION_TO_CODE[p.current_theater_classification];
    if (!classification) {
      throw new Error(`Unrecognized classification: ${p.current_theater_classification}`);
    }
    return {
      type: "Feature",
      geometry: f.geometry,
      properties: {
        theaterId: p.theater_id,
        name: p.name,
        alternateNames: p.alternate_names || null,
        historicalAddress: p.historical_address,
        borough: p.borough,
        openingYear: p.opening_year,
        closingYear: p.closing_year === "unknown" ? null : p.closing_year,
        historicalStatus: p.historical_status,
        sourceUrl: p.source_url || null,
        bbl: p.bbl,
        currentBaseZoning: p.current_base_zoning,
        currentCommercialOverlay: p.current_commercial_overlay || null,
        effectiveUseDistrict: p.effective_use_district,
        specialPurposeDistrict: p.special_purpose_district || null,
        specialSubdistrict: p.special_subdistrict || null,
        classification,
        classificationLabel: p.current_theater_classification,
        classificationExplanation: p.classification_explanation,
        screeningConfidence: p.screening_confidence,
        manualReviewReason: p.manual_review_reason || null,
        zoningDataDate: p.zoning_data_date,
        ruleCitation: p.rule_citation,
      },
    };
  });

  const counts = features.reduce((acc, f) => {
    acc[f.properties.classification] = (acc[f.properties.classification] ?? 0) + 1;
    return acc;
  }, {});
  console.log("Classification counts:", counts, "total:", features.length);

  const collection = { type: "FeatureCollection", features };
  mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(collection));
  console.log(`Wrote ${OUT_PATH}`);
}

main();
