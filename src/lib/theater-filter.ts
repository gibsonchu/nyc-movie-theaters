import type { FilterSpecification } from "maplibre-gl";
import { FADE_YEARS } from "./timeline";

/**
 * Only render theaters that have opened by the current year (plus their fade-in
 * window) — keeps hit-testing honest and rendering cheap. Closed theaters stay
 * rendered indefinitely once opened: they settle into light grey dots via
 * circleColorExpression/circleOpacityExpression rather than being filtered out.
 */
export function buildTheaterFilter(year: number): FilterSpecification {
  return ["<=", ["-", ["get", "openingYear"], FADE_YEARS], year] as unknown as FilterSpecification;
}
