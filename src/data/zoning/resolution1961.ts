import { zonesToCollection, type ZoneBox } from "@/lib/geo";
import type { ZoningDataset } from "@/types/zoning";

/**
 * MOCK / ILLUSTRATIVE — the 1961 Zoning Resolution (still the framework in
 * effect today, as amended) uses a much finer-grained district system.
 * Commercial-overlay corridors generally permit theaters as of right;
 * many residential districts require a special permit for public assembly
 * uses above a certain size; some manufacturing districts exclude places
 * of assembly outright. Simplified stand-in boundaries — replace with a
 * real generalization of current NYC zoning districts (Use Group 8).
 */
const zones: ZoneBox[] = [
  {
    bbox: [-74.005, 40.705, -73.97, 40.77],
    category: "permitted",
    name: "Manhattan Commercial Core (C4–C6)",
    sourceCode: "Use Group 8 — as of right",
  },
  {
    bbox: [-73.99, 40.77, -73.95, 40.82],
    category: "conditional",
    name: "Upper Manhattan Mixed Residential (R7–R8 / C1-C2 overlay)",
    sourceCode: "Use Group 8 — commercial overlay required",
  },
  {
    bbox: [-73.99, 40.7, -73.965, 40.75],
    category: "special-permit",
    name: "East Side Contextual Residence Districts (R8B/R9)",
    sourceCode: "Use Group 8 — CPC special permit",
  },
  {
    bbox: [-73.93, 40.8, -73.885, 40.87],
    category: "permitted",
    name: "Grand Concourse Commercial Corridor, Bronx",
    sourceCode: "Use Group 8 — as of right",
  },
  {
    bbox: [-73.88, 40.85, -73.79, 40.91],
    category: "not-permitted",
    name: "Riverdale / Northeast Bronx Low-Density (R1–R3)",
    sourceCode: "Use Group 8 — not permitted",
  },
  {
    bbox: [-74.015, 40.68, -73.95, 40.7],
    category: "permitted",
    name: "Downtown Brooklyn / Fulton Mall (C6)",
    sourceCode: "Use Group 8 — as of right",
  },
  {
    bbox: [-73.98, 40.63, -73.93, 40.68],
    category: "conditional",
    name: "Flatbush Commercial Overlay",
    sourceCode: "Use Group 8 — commercial overlay required",
  },
  {
    bbox: [-73.99, 40.57, -73.93, 40.63],
    category: "not-permitted",
    name: "South Brooklyn Low-Density (R1–R4)",
    sourceCode: "Use Group 8 — not permitted",
  },
  {
    bbox: [-73.86, 40.7, -73.78, 40.755],
    category: "permitted",
    name: "Jamaica Downtown Commercial Corridor, Queens",
    sourceCode: "Use Group 8 — as of right",
  },
  {
    bbox: [-73.83, 40.735, -73.7, 40.8],
    category: "not-permitted",
    name: "Eastern Queens Low-Density (R1–R3)",
    sourceCode: "Use Group 8 — not permitted",
  },
  {
    bbox: [-73.9, 40.72, -73.83, 40.77],
    category: "special-permit",
    name: "Flushing Special Downtown District",
    sourceCode: "Special Flushing District",
  },
  {
    bbox: [-73.79, 40.57, -73.7, 40.68],
    category: "not-permitted",
    name: "Rockaways Low-Density (R2–R4)",
    sourceCode: "Use Group 8 — not permitted",
  },
  {
    bbox: [-74.18, 40.59, -74.06, 40.65],
    category: "not-permitted",
    name: "Staten Island Low-Density (R1–R3A)",
    sourceCode: "Use Group 8 — not permitted",
  },
  {
    bbox: [-74.1, 40.62, -74.065, 40.65],
    category: "conditional",
    name: "St. George / Stapleton Commercial Overlay",
    sourceCode: "Use Group 8 — commercial overlay required",
  },
];

export const resolution1961: ZoningDataset = {
  id: "resolution-1961",
  label: "1961 Zoning Resolution (as amended)",
  startYear: 1961,
  endYear: null,
  description:
    "The current zoning framework, in force since 1961 and amended many times since, regulates 'places of assembly' like theaters (Use Group 8) more granularly — as-of-right on most commercial corridors, but often requiring a special permit or excluded outright in lower-density residential and manufacturing districts.",
  geojson: zonesToCollection(zones),
};
