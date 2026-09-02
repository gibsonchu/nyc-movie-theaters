import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

/**
 * Plain-language zoning categories, standing in for raw zoning-resolution
 * use-group codes so a general reader can understand where theaters were
 * (or weren't) allowed without decoding municipal code.
 */
export type ZoningCategory =
  | "permitted"
  | "conditional"
  | "special-permit"
  | "not-permitted";

export interface ZoningFeatureProperties {
  category: ZoningCategory;
  name?: string;
  /** Original code this simplified category was derived from, for reference. */
  sourceCode?: string;
}

export type ZoningFeature = Feature<Polygon | MultiPolygon, ZoningFeatureProperties>;
export type ZoningFeatureCollection = FeatureCollection<
  Polygon | MultiPolygon,
  ZoningFeatureProperties
>;

export interface ZoningDataset {
  id: string;
  label: string;
  /** First year this zoning regime applies. */
  startYear: number;
  /** Last year this zoning regime applies. Null = still in effect. */
  endYear: number | null;
  description: string;
  geojson: ZoningFeatureCollection;
}

export const ZONING_CATEGORY_LABELS: Record<ZoningCategory, string> = {
  permitted: "Theater generally permitted",
  conditional: "Permitted with additional conditions",
  "special-permit": "Special permit or unusual circumstances",
  "not-permitted": "Not generally permitted",
};

export const ZONING_CATEGORY_COLORS: Record<ZoningCategory, string> = {
  permitted: "#8a9a5b",
  conditional: "#c9a227",
  "special-permit": "#b5651d",
  "not-permitted": "#8c8c8c",
};
