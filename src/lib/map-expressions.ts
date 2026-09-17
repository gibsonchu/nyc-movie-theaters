import type { ExpressionSpecification } from "maplibre-gl";
import { FADE_YEARS, MAX_YEAR, OPEN_ENDED_SENTINEL } from "./timeline";

/**
 * Builds a 0..1 opacity expression for "has this theater opened yet",
 * fading in over FADE_YEARS around the opening year. `year` is embedded
 * as a literal captured at call time — callers rebuild this whenever the
 * selected timeline year changes.
 */
export function openProgressExpression(year: number): ExpressionSpecification {
  return [
    "interpolate",
    ["linear"],
    ["-", year, ["get", "openingYear"]],
    -FADE_YEARS,
    0,
    0,
    1,
  ] as unknown as ExpressionSpecification;
}

/**
 * Builds a 0..1 "still looks open" expression, fading from 1 to 0 over
 * FADE_YEARS after the closing year (or staying at 1 forever for the
 * OPEN_ENDED_SENTINEL closing year, since that value is far beyond the
 * timeline's max). At the timeline's final year every already-closed
 * theater is snapped straight to 0 instead of left mid-fade — otherwise a
 * theater that closed within the last FADE_YEARS (e.g. one closing in
 * 2026 itself) would still read as "open" at the very end of the scroll,
 * since there's no year beyond MAX_YEAR left to finish its fade.
 */
export function closeProgressExpression(year: number): ExpressionSpecification {
  if (year >= MAX_YEAR) {
    return [
      "case",
      ["==", ["get", "closingYear"], OPEN_ENDED_SENTINEL],
      1,
      0,
    ] as unknown as ExpressionSpecification;
  }
  return [
    "interpolate",
    ["linear"],
    ["-", ["get", "closingYear"], year],
    -FADE_YEARS,
    0,
    0,
    1,
  ] as unknown as ExpressionSpecification;
}

/** Closed theaters settle at this opacity as light grey dots rather than disappearing. */
const CLOSED_OPACITY = 0.4;

export function circleOpacityExpression(year: number): ExpressionSpecification {
  return [
    "*",
    openProgressExpression(year),
    ["interpolate", ["linear"], closeProgressExpression(year), 0, CLOSED_OPACITY, 1, 1],
  ] as unknown as ExpressionSpecification;
}

const OPEN_COLOR = "#a4283c";
const CLOSED_COLOR = "#c7c9ca";

/** Fades a theater's dot color from accent red (open) to light grey (closed) as it closes. */
export function circleColorExpression(year: number): ExpressionSpecification {
  return [
    "interpolate",
    ["linear"],
    closeProgressExpression(year),
    0,
    CLOSED_COLOR,
    1,
    OPEN_COLOR,
  ] as unknown as ExpressionSpecification;
}

/** Every theater renders at the same size — the map encodes when a theater operated, not how notable it is. */
const BASE_RADIUS = 5;

export function circleRadiusExpression(year: number): ExpressionSpecification {
  return [
    "*",
    BASE_RADIUS,
    ["max", 0.18, openProgressExpression(year)],
  ] as unknown as ExpressionSpecification;
}
