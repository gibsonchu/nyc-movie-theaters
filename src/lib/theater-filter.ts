import type { FilterSpecification } from "maplibre-gl";
import { FADE_YEARS } from "./timeline";

/** Only render theaters whose fade window overlaps the current year — keeps hit-testing honest and rendering cheap. */
export function buildTheaterFilter(year: number): FilterSpecification {
  return [
    "all",
    ["<=", ["-", ["get", "openingYear"], FADE_YEARS], year],
    [">=", ["+", ["get", "closingYear"], FADE_YEARS], year],
  ] as unknown as FilterSpecification;
}
