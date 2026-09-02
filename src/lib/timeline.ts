export const MIN_YEAR = 1896;
export const MAX_YEAR = 2026;
export const DEFAULT_YEAR = 1929;

/** Milliseconds between year advances while Play is running. */
export const PLAY_INTERVAL_MS = 320;

/** Years over which a theater dot fades in/out around its open/close year. */
export const FADE_YEARS = 1.5;

/** Years a narrative callout stays visible after its trigger year. */
export const NARRATIVE_DWELL_YEARS = 6;

export function clampYear(year: number): number {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(year)));
}

/** Sentinel used in GeoJSON properties to represent "still open" (null closingYear). */
export const OPEN_ENDED_SENTINEL = 9999;
