import { zonesToCollection, type ZoneBox } from "@/lib/geo";
import type { ZoningDataset } from "@/types/zoning";

/**
 * MOCK / ILLUSTRATIVE — before the city's first comprehensive zoning
 * resolution, land use was governed loosely by nuisance law and building
 * codes rather than use districts. Represented here as broadly permitted
 * with a couple of contested residential enclaves. Replace with a
 * researched reconstruction of pre-1916 land-use patterns.
 */
const zones: ZoneBox[] = [
  {
    bbox: [-74.02, 40.7, -73.93, 40.83],
    category: "permitted",
    name: "Manhattan — largely unregulated commercial mixing",
  },
  {
    bbox: [-73.93, 40.79, -73.85, 40.9],
    category: "permitted",
    name: "Bronx — mixed development corridor",
  },
  {
    bbox: [-74.05, 40.61, -73.9, 40.74],
    category: "permitted",
    name: "Brooklyn — mixed commercial/residential",
  },
  {
    bbox: [-73.96, 40.6, -73.78, 40.78],
    category: "permitted",
    name: "Queens — mixed commercial/residential",
  },
  {
    bbox: [-74.2, 40.5, -74.05, 40.65],
    category: "permitted",
    name: "Staten Island — mixed development",
  },
  {
    bbox: [-73.99, 40.77, -73.945, 40.8],
    category: "conditional",
    name: "Upper West Side — restrictive deed covenants",
  },
  {
    bbox: [-73.97, 40.77, -73.94, 40.8],
    category: "conditional",
    name: "Upper East Side — restrictive deed covenants",
  },
];

export const preZoning: ZoningDataset = {
  id: "pre-zoning",
  label: "Before Zoning (no citywide use districts)",
  startYear: 1896,
  endYear: 1915,
  description:
    "New York had no comprehensive zoning until 1916. Land use was shaped instead by private deed restrictions, nuisance law and the market — theaters could open almost anywhere an owner allowed one.",
  geojson: zonesToCollection(zones),
};
