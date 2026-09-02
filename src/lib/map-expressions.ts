import type { ExpressionSpecification } from "maplibre-gl";
import { FADE_YEARS } from "./timeline";

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
 * Builds a 0..1 opacity expression for "has this theater closed yet",
 * fading out over FADE_YEARS around the closing year (or staying at 1
 * forever for the OPEN_ENDED_SENTINEL closing year, since that value is
 * far beyond the timeline's max).
 */
export function closeProgressExpression(year: number): ExpressionSpecification {
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

export function circleOpacityExpression(year: number): ExpressionSpecification {
  return [
    "*",
    openProgressExpression(year),
    closeProgressExpression(year),
  ] as unknown as ExpressionSpecification;
}

export function circleRadiusExpression(year: number): ExpressionSpecification {
  const baseRadius: ExpressionSpecification = [
    "case",
    ["==", ["get", "featured"], 1],
    7,
    4.5,
  ] as unknown as ExpressionSpecification;

  return [
    "*",
    baseRadius,
    ["max", 0.18, openProgressExpression(year)],
  ] as unknown as ExpressionSpecification;
}
