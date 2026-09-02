import { zonesToCollection, type ZoneBox } from "@/lib/geo";
import type { ZoningDataset } from "@/types/zoning";

/**
 * MOCK / ILLUSTRATIVE — the 1916 Zoning Resolution introduced Residence,
 * Business and Unrestricted districts. Business/Unrestricted districts
 * generally allowed theaters; Residence districts restricted or excluded
 * them. Boundaries here are simplified stand-ins for the real 1916 use
 * map, meant to demonstrate the layer rather than serve as source data.
 */
const zones: ZoneBox[] = [
  {
    bbox: [-74.01, 40.7, -73.965, 40.775],
    category: "permitted",
    name: "Midtown/Downtown Business District",
    sourceCode: "Business District",
  },
  {
    bbox: [-73.99, 40.775, -73.955, 40.82],
    category: "conditional",
    name: "Upper Manhattan Residence District",
    sourceCode: "Residence District",
  },
  {
    bbox: [-73.965, 40.7, -73.93, 40.75],
    category: "conditional",
    name: "East Side Residence District",
    sourceCode: "Residence District",
  },
  {
    bbox: [-73.93, 40.8, -73.87, 40.885],
    category: "permitted",
    name: "Grand Concourse Business Corridor, Bronx",
    sourceCode: "Business District",
  },
  {
    bbox: [-73.87, 40.83, -73.79, 40.9],
    category: "not-permitted",
    name: "Northeast Bronx Residence District",
    sourceCode: "Residence District",
  },
  {
    bbox: [-74.02, 40.65, -73.94, 40.7],
    category: "permitted",
    name: "Downtown Brooklyn / Flatbush Business Corridor",
    sourceCode: "Business District",
  },
  {
    bbox: [-73.99, 40.57, -73.94, 40.65],
    category: "not-permitted",
    name: "South Brooklyn Residence District",
    sourceCode: "Residence District",
  },
  {
    bbox: [-73.94, 40.65, -73.86, 40.72],
    category: "conditional",
    name: "Central Brooklyn Mixed District",
    sourceCode: "Residence District",
  },
  {
    bbox: [-73.86, 40.7, -73.78, 40.76],
    category: "permitted",
    name: "Jamaica Business Corridor, Queens",
    sourceCode: "Business District",
  },
  {
    bbox: [-73.83, 40.75, -73.7, 40.8],
    category: "not-permitted",
    name: "Northeast Queens Residence District",
    sourceCode: "Residence District",
  },
  {
    bbox: [-73.96, 40.72, -73.86, 40.78],
    category: "special-permit",
    name: "Flushing Special District",
    sourceCode: "Unrestricted District (contested)",
  },
  {
    bbox: [-74.18, 40.6, -74.06, 40.65],
    category: "not-permitted",
    name: "Staten Island Residence District",
    sourceCode: "Residence District",
  },
  {
    bbox: [-74.1, 40.62, -74.06, 40.65],
    category: "permitted",
    name: "St. George Business Corridor, Staten Island",
    sourceCode: "Business District",
  },
];

export const resolution1916: ZoningDataset = {
  id: "resolution-1916",
  label: "1916 Zoning Resolution",
  startYear: 1916,
  endYear: 1960,
  description:
    "The nation's first comprehensive zoning resolution split the city into Residence, Business and Unrestricted districts. Movie theaters were generally treated as a business use, welcomed on commercial corridors but restricted out of Residence districts.",
  geojson: zonesToCollection(zones),
};
