#!/usr/bin/env node
// Builds public/zoning/current-zoning.geojson — a citywide, present-day "can a
// movie theater go here" screening layer — from the NYC DCP GIS Zoning
// Features shapefile release (base zoning districts + commercial overlays).
//
// Source: NYC Department of City Planning, GIS Zoning Features, July 2026.
// Rules: ZR 32-181, 32-183, 42-181, per current_theater_classification_rules_2026.csv
// (the same crosswalk used for the historical-theater-site screening in
// nyc_historical_theaters_current_zoning_2026.geojson).
//
// Re-run after updating the source shapefile:
//   node scripts/import-current-zoning.mjs <path-to-unzipped-shapefile-dir>

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import proj4 from "proj4";
import * as shapefile from "shapefile";
import simplify from "@turf/simplify";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SHP_DIR = process.argv[2] ?? "/tmp/zoning_raw/nycgiszoningfeatures_202607shp";
const OUT_PATH = path.join(ROOT, "public/zoning/current-zoning.geojson");

// NAD83 State Plane New York Long Island (feet) — read from nyzd.prj.
const SOURCE_CRS =
  "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 " +
  "+lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs";
const project = proj4(SOURCE_CRS, "WGS84");

function reprojectRing(ring) {
  return ring.map(([x, y]) => project.forward([x, y]));
}

function reprojectGeometry(geometry) {
  if (geometry.type === "Polygon") {
    return { type: "Polygon", coordinates: geometry.coordinates.map(reprojectRing) };
  }
  if (geometry.type === "MultiPolygon") {
    return {
      type: "MultiPolygon",
      coordinates: geometry.coordinates.map((poly) => poly.map(reprojectRing)),
    };
  }
  throw new Error(`Unexpected geometry type: ${geometry.type}`);
}

async function readAllFeatures(shpPath, dbfPath) {
  const source = await shapefile.open(shpPath, dbfPath);
  const features = [];
  let result;
  while (!(result = await source.read()).done) {
    features.push(result.value);
  }
  return features;
}

// --- Ray-casting point-in-polygon (works in the source projected plane, no
// distortion concerns since it's a simple Cartesian coordinate system). ---
function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInGeometry(x, y, geometry) {
  const polys = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  for (const rings of polys) {
    if (!pointInRing(x, y, rings[0])) continue; // outside outer ring
    let inHole = false;
    for (let h = 1; h < rings.length; h++) {
      if (pointInRing(x, y, rings[h])) {
        inHole = true;
        break;
      }
    }
    if (!inHole) return true;
  }
  return false;
}

function ringCentroid(ring) {
  // Area-weighted polygon centroid (shoelace formula); falls back to a plain
  // vertex average for degenerate (near-zero-area) rings.
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const cross = xj * yi - xi * yj;
    area += cross;
    cx += (xj + xi) * cross;
    cy += (yj + yi) * cross;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-6) {
    const n = ring.length;
    const sum = ring.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
    return [sum[0] / n, sum[1] / n];
  }
  return [cx / (6 * area), cy / (6 * area)];
}

function geometryCentroid(geometry) {
  const outerRing = geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates[0][0];
  return ringCentroid(outerRing);
}

function bbox(geometry) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const polys = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  for (const rings of polys) {
    for (const [x, y] of rings[0]) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return [minX, minY, maxX, maxY];
}

// --- Simple uniform-grid spatial index over base-district bounding boxes. ---
const CELL_SIZE = 2500; // feet

class SpatialIndex {
  constructor(items) {
    this.cells = new Map();
    for (const item of items) {
      const [minX, minY, maxX, maxY] = item.bbox;
      for (let cx = Math.floor(minX / CELL_SIZE); cx <= Math.floor(maxX / CELL_SIZE); cx++) {
        for (let cy = Math.floor(minY / CELL_SIZE); cy <= Math.floor(maxY / CELL_SIZE); cy++) {
          const key = `${cx},${cy}`;
          if (!this.cells.has(key)) this.cells.set(key, []);
          this.cells.get(key).push(item);
        }
      }
    }
  }
  candidatesAt(x, y) {
    const key = `${Math.floor(x / CELL_SIZE)},${Math.floor(y / CELL_SIZE)}`;
    return this.cells.get(key) ?? [];
  }
}

/**
 * Classifies an effective zoning district string into one of the four
 * screening categories, per current_theater_classification_rules_2026.csv
 * (ZR 32-181, 32-183, 42-181). Conservative fallback: unrecognized codes
 * read as "not_permitted" rather than guessing permitted.
 */
function classifyDistrict(code) {
  if (!code) return "not_permitted";
  if (/^C1-[1-4][A-Z]?$/.test(code)) return "permitted";
  if (/^C2-[1-4][A-Z]?$/.test(code)) return "permitted";
  if (/^C1-5/.test(code)) return "restricted";
  if (/^C2-5/.test(code)) return "restricted";
  if (/^C4-(1|2|3|4)([A-Z.]|$)/.test(code)) return "permitted";
  if (/^C4-(5|6|7|8|9|11)([A-Z.]|$)/.test(code)) return "restricted";
  if (/^C5/.test(code)) return "restricted";
  if (/^C6/.test(code)) return "restricted";
  if (/^C7/.test(code)) return "permitted";
  if (/^C8-4/.test(code)) return "restricted";
  if (/^C8-[1-3]/.test(code)) return "permitted";
  if (/^M[123]/.test(code)) return "permitted"; // also matches mixed "M1-2/R6A"-style codes
  if (/^C3/.test(code)) return "not_permitted";
  if (/^R\d/.test(code)) return "not_permitted";
  if (code === "PARK" || code === "BPC") return "not_permitted";
  return "not_permitted";
}

async function main() {
  console.log("Reading base zoning districts (nyzd)...");
  const baseFeatures = await readAllFeatures(path.join(SHP_DIR, "nyzd.shp"), path.join(SHP_DIR, "nyzd.dbf"));
  console.log(`  ${baseFeatures.length} base district polygons`);

  console.log("Reading commercial overlays (nyco)...");
  const overlayFeatures = await readAllFeatures(path.join(SHP_DIR, "nyco.shp"), path.join(SHP_DIR, "nyco.dbf"));
  console.log(`  ${overlayFeatures.length} overlay polygons`);

  // Index base polygons by bounding box so we can find, for each overlay's
  // centroid, which base polygon(s) it falls inside.
  const baseItems = baseFeatures.map((f, i) => ({
    index: i,
    zonedist: f.properties.ZONEDIST,
    geometry: f.geometry,
    bbox: bbox(f.geometry),
    overlay: null, // filled in below
  }));
  const baseIndex = new SpatialIndex(baseItems);

  console.log("Matching overlays to base districts (point-in-polygon on overlay centroids)...");
  let matched = 0;
  for (const overlay of overlayFeatures) {
    const [cx, cy] = geometryCentroid(overlay.geometry);
    const candidates = baseIndex.candidatesAt(cx, cy);
    for (const base of candidates) {
      if (pointInGeometry(cx, cy, base.geometry)) {
        // A C1/C2 overlay only changes the *effective* district when it
        // sits atop a Residence District — matches the source analysis's
        // "effective use district" rule. Elsewhere (e.g. atop a C6 base,
        // or where two overlays share a residential block) keep whichever
        // overlay is found first; classification outcome rarely depends on
        // which one wins since overlapping overlays are usually the same
        // permitted/restricted bucket.
        if (/^R\d/.test(base.zonedist) && !base.overlay) {
          base.overlay = overlay.properties.OVERLAY;
          matched++;
        }
      }
    }
  }
  console.log(`  ${matched} base polygons received an overlay-derived effective district`);

  const features = baseItems.map((base) => {
    const effective = base.overlay ?? base.zonedist;
    const classification = classifyDistrict(effective);
    return {
      type: "Feature",
      geometry: reprojectGeometry(base.geometry),
      properties: {
        zonedist: base.zonedist,
        overlay: base.overlay,
        effective_district: effective,
        classification,
      },
    };
  });

  const counts = features.reduce((acc, f) => {
    acc[f.properties.classification] = (acc[f.properties.classification] ?? 0) + 1;
    return acc;
  }, {});
  console.log("Classification counts:", counts);

  const collection = { type: "FeatureCollection", features };
  // Lot-following boundaries carry far more vertex detail than this citywide
  // screening layer needs at map-view zoom levels — simplify to keep the
  // fetched file reasonable (this is loaded on demand, not bundled).
  const simplified = simplify(collection, { tolerance: 0.00003, highQuality: true, mutate: true });

  mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(simplified));
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
