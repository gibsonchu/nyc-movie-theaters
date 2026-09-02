import type { ZoningDataset } from "@/types/zoning";
import { preZoning } from "./preZoning";
import { resolution1916 } from "./resolution1916";
import { resolution1961 } from "./resolution1961";

/**
 * All zoning eras, ordered chronologically. Each dataset declares its own
 * startYear/endYear so the active layer can be derived from the selected
 * timeline year without any visualization code knowing about eras.
 */
export const zoningDatasets: ZoningDataset[] = [preZoning, resolution1916, resolution1961];

export function getActiveZoningDataset(year: number): ZoningDataset | null {
  return (
    zoningDatasets.find(
      (dataset) => year >= dataset.startYear && (dataset.endYear === null || year <= dataset.endYear)
    ) ?? null
  );
}
