/**
 * The present-day "could a movie theater open here" screening, distinct from
 * the historical-era ZoningCategory scheme in `types/zoning.ts` — this one
 * covers just today's rules (ZR 32-181, 32-183, 42-181) applied citywide,
 * both to the zoning map itself and to every historical theater site.
 */
export type CurrentZoningClassification = "permitted" | "restricted" | "special" | "not_permitted";

export const CURRENT_ZONING_LABELS: Record<CurrentZoningClassification, string> = {
  permitted: "Theater permitted today",
  restricted: "Theater permitted with restrictions",
  special: "Special approval required",
  not_permitted: "Theater not permitted",
};

export const CURRENT_ZONING_COLORS: Record<CurrentZoningClassification, string> = {
  permitted: "#4f7942",
  restricted: "#c9a227",
  special: "#6b4c8a",
  not_permitted: "#a4283c",
};

export interface CurrentZoningPolygonProperties {
  zonedist: string;
  overlay: string | null;
  effective_district: string;
  classification: CurrentZoningClassification;
}

export interface CurrentZoningTheaterProperties {
  theaterId: string;
  name: string;
  alternateNames: string | null;
  historicalAddress: string;
  borough: string;
  openingYear: string;
  closingYear: string | null;
  historicalStatus: string;
  sourceUrl: string | null;
  bbl: string;
  currentBaseZoning: string;
  currentCommercialOverlay: string | null;
  effectiveUseDistrict: string;
  specialPurposeDistrict: string | null;
  specialSubdistrict: string | null;
  classification: CurrentZoningClassification;
  classificationLabel: string;
  classificationExplanation: string;
  screeningConfidence: string;
  manualReviewReason: string | null;
  zoningDataDate: string;
  ruleCitation: string;
}
