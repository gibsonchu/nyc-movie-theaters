#!/usr/bin/env node
// Converts data-source/nyc_cinema_treasures_theaters.csv into src/data/theaters.ts.
// Re-run after updating the source CSV: node scripts/import-theaters.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CSV_PATH = path.join(ROOT, "data-source/nyc_cinema_treasures_theaters.csv");
const OUT_PATH = path.join(ROOT, "src/data/theaters.ts");

const MIN_YEAR = 1896; // when film exhibition began in NYC — the timeline's floor

// A small set of well-known theaters to emphasize editorially (bigger mark,
// eligible to anchor narrative callouts). Matched by Cinema Treasures id.
const FEATURED_IDS = new Set([
  "2975", // RKO Warner Twin Theatre (Mark Strand)
  "834", // RKO Keith's Theatre, Flushing
  "900", // Loew's Paradise Theatre
  "1360", // Kings Theatre
  "903", // Loew's Valencia Theatre
  "1865", // St. George Theatre
  "44", // United Palace of Cultural Arts
  "55", // Radio City Music Hall
  "24816", // AMC Magic Johnson Harlem 9
  "6156", // Kew Gardens Cinemas
]);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

function toIntOrNull(s) {
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function deriveStatus(raw) {
  return raw.startsWith("Open") ? "open" : "closed";
}

function deriveTheaterType(screens) {
  if (screens && screens > 1) return "multiplex";
  return "unknown";
}

function buildDescription({ borough, openingYear, closingYear, reopeningYear, status, notes }) {
  const parts = [];
  if (status === "open") {
    parts.push(`Operating in ${borough} since ${openingYear}.`);
  } else if (closingYear != null) {
    parts.push(`Operated in ${borough} from ${openingYear} to ${closingYear}.`);
  } else {
    parts.push(`Opened in ${borough} in ${openingYear}; the closing year wasn't recorded.`);
  }
  if (reopeningYear != null) {
    parts.push(`Reopened in ${reopeningYear} after an earlier closure.`);
  }
  if (notes) parts.push(notes.trim());
  return parts.join(" ");
}

function main() {
  const csvText = readFileSync(CSV_PATH, "utf-8");
  const raws = parseCsv(csvText);

  let skippedNoYear = 0;
  let skippedNoGeo = 0;
  let skippedPreCinema = 0;
  let closedUnknownYear = 0;
  let hadReopening = 0;
  let badOrder = 0;

  const theaters = [];

  for (const raw of raws) {
    if (!raw.opening_year) {
      skippedNoYear++;
      continue;
    }
    if (!raw.latitude || !raw.longitude) {
      skippedNoGeo++;
      continue;
    }

    const status = deriveStatus(raw.status);
    const openingYearRaw = toIntOrNull(raw.opening_year);
    let closingYear = status === "open" ? null : toIntOrNull(raw.closing_year);
    const reopeningYear = toIntOrNull(raw.reopening_year);

    if (closingYear != null && closingYear < openingYearRaw) {
      // A handful of source rows have closing < opening (data entry errors
      // upstream). Treat the closing year as unrecorded rather than propagate
      // a nonsensical range.
      closingYear = null;
      badOrder++;
    }

    if (closingYear != null && closingYear < MIN_YEAR) {
      // Closed before film exhibition began in NYC — it never operated
      // during the period this timeline covers, so it has no honest place
      // on the map (clamping it to MIN_YEAR would show a fake blip).
      skippedPreCinema++;
      continue;
    }

    if (status === "closed" && closingYear == null) closedUnknownYear++;
    if (reopeningYear != null) hadReopening++;

    // Keep the true opening year here (a few dozen predate 1896, the year
    // film exhibition began in NYC — likely the building's construction
    // date under an earlier use). The map/timeline clamp to MIN_YEAR/
    // MAX_YEAR for display; this file stays factually accurate.
    const openingYear = openingYearRaw;
    const screens = toIntOrNull(raw.screen_count);
    const borough = raw.borough;

    const description = buildDescription({
      borough,
      openingYear: openingYearRaw,
      closingYear,
      reopeningYear,
      status,
      notes: raw.notes,
    });

    theaters.push({
      id: raw.theater_id,
      name: raw.name,
      alternateNames: raw.alternate_names ? raw.alternate_names.split(", ").filter(Boolean) : [],
      address: raw.address,
      latitude: Number(raw.latitude),
      longitude: Number(raw.longitude),
      borough,
      openingYear,
      closingYear,
      reopeningYear,
      status,
      theaterType: deriveTheaterType(screens),
      screens,
      seats: null,
      operator: null,
      featured: FEATURED_IDS.has(raw.theater_id),
      image: null,
      description,
      confidence: raw.confidence || "low",
      sources: [{ label: "Cinema Treasures", url: raw.source_url || undefined }],
    });
  }

  const banner = `// AUTO-GENERATED by scripts/import-theaters.mjs from
// data-source/nyc_cinema_treasures_theaters.csv — do not hand-edit.
// Re-run: node scripts/import-theaters.mjs
//
// ${theaters.length} of ${raws.length} source rows are included here.
// Excluded: ${skippedNoYear} with no opening year, ${skippedNoGeo} with no
// coordinates, ${skippedPreCinema} that closed before 1896 (predate film
// exhibition in NYC). Of the included rows, ${closedUnknownYear} are known
// closed but the exact closing year wasn't recorded (they're shown as
// present on the map through the end of the timeline, flagged as such in
// the UI); ${hadReopening} record a reopening after an earlier closure.
`;

  const out = `${banner}
import type { Theater } from "@/types/theater";

export const theaters: Theater[] = ${JSON.stringify(theaters, null, 2)} satisfies Theater[];
`;

  writeFileSync(OUT_PATH, out);

  console.log(`Wrote ${theaters.length} theaters to ${path.relative(ROOT, OUT_PATH)}`);
  console.log(`  skipped (no opening_year): ${skippedNoYear}`);
  console.log(`  skipped (no lat/lng): ${skippedNoGeo}`);
  console.log(`  skipped (closed before 1896): ${skippedPreCinema}`);
  console.log(`  closed with unknown closing year: ${closedUnknownYear}`);
  console.log(`  had a reopening_year: ${hadReopening}`);
  console.log(`  bad close<open order (dropped closing year): ${badOrder}`);
}

main();
