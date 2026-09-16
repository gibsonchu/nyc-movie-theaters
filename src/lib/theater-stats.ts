import type { Borough, Theater } from "@/types/theater";
import { MAX_YEAR, MIN_YEAR } from "./timeline";

/**
 * Reusable derived-data functions over the theater dataset. Every number the
 * narrative sections display is computed here from `Theater[]` — nothing in
 * this file (or its callers) should hardcode a statistic.
 *
 * A recurring data-shape problem drives a few of these functions: a theater
 * confirmed closed (`status === "closed"`) doesn't always have a
 * `closingYear` — for ~260 theaters the exact year was never recorded (even
 * after a geocoding + address audit confirmed the closure itself). We never
 * invent a year for these. Instead, functions that need to know whether a
 * theater was active in a specific year report those separately as
 * "uncertain" rather than folding them into a "confirmed" count.
 */

export type ActivityStatus = "confirmed" | "uncertain" | "inactive";

/**
 * Was this theater active in `year`?
 *  - "confirmed": known to be open that year (open interval, or a closed
 *    interval with a recorded closing year that hasn't passed yet).
 *  - "uncertain": opened by `year` and confirmed closed at *some* point, but
 *    the closing year wasn't recorded, so we can't rule out `year`.
 *  - "inactive": opened after `year`, or confirmed closed by a recorded year
 *    at or before `year`.
 */
export function activityInYear(theater: Theater, year: number): ActivityStatus {
  if (theater.openingYear > year) return "inactive";
  if (theater.status === "open") return "confirmed";
  if (theater.closingYear != null) return year <= theater.closingYear ? "confirmed" : "inactive";
  return "uncertain";
}

export interface YearCounts {
  year: number;
  confirmed: number;
  uncertain: number;
}

/** Confirmed + uncertain active-theater counts for each year in [fromYear, toYear]. */
export function activeCountsByYear(
  theaters: Theater[],
  fromYear: number = MIN_YEAR,
  toYear: number = MAX_YEAR
): YearCounts[] {
  const out: YearCounts[] = [];
  for (let year = fromYear; year <= toYear; year++) {
    let confirmed = 0;
    let uncertain = 0;
    for (const t of theaters) {
      const status = activityInYear(t, year);
      if (status === "confirmed") confirmed++;
      else if (status === "uncertain") uncertain++;
    }
    out.push({ year, confirmed, uncertain });
  }
  return out;
}

/** Same as {@link activeCountsByYear}, broken out per borough. */
export function activeCountsByYearAndBorough(
  theaters: Theater[],
  fromYear: number = MIN_YEAR,
  toYear: number = MAX_YEAR
): Record<Borough, YearCounts[]> {
  const boroughs: Borough[] = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];
  const result = {} as Record<Borough, YearCounts[]>;
  for (const b of boroughs) {
    result[b] = activeCountsByYear(
      theaters.filter((t) => t.borough === b),
      fromYear,
      toYear
    );
  }
  return result;
}

export interface DecadeCount {
  decade: number;
  count: number;
}

function toDecade(year: number): number {
  return Math.floor(year / 10) * 10;
}

/** Openings bucketed by decade. Every theater has an opening year, so this covers the full dataset. */
export function openingsByDecade(theaters: Theater[]): DecadeCount[] {
  return bucketByDecade(theaters.map((t) => t.openingYear));
}

/**
 * Closures bucketed by decade — only theaters with a *recorded* closing
 * year. Theaters confirmed closed at an unrecorded date (see module docs)
 * are intentionally excluded; use {@link undatedClosureCount} to report that
 * gap alongside this chart.
 */
export function closuresByDecade(theaters: Theater[]): DecadeCount[] {
  return bucketByDecade(
    theaters.filter((t) => t.status === "closed" && t.closingYear != null).map((t) => t.closingYear as number)
  );
}

/** How many confirmed-closed theaters have no recorded closing year — the gap {@link closuresByDecade} can't fill. */
export function undatedClosureCount(theaters: Theater[]): number {
  return theaters.filter((t) => t.status === "closed" && t.closingYear == null).length;
}

function bucketByDecade(years: number[]): DecadeCount[] {
  const counts = new Map<number, number>();
  for (const year of years) {
    const decade = toDecade(year);
    counts.set(decade, (counts.get(decade) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => a.decade - b.decade);
}

export interface Lifespan {
  /** Duration in years, when computable. */
  years: number | null;
  /** Still operating — the span is ongoing, not a fixed lifetime. */
  openEnded: boolean;
  /** Confirmed closed, but the closing year (and so the duration) is unknown. */
  unknownEnd: boolean;
}

/** How long a theater operated. `asOfYear` only affects still-open theaters (defaults to the timeline's present). */
export function getLifespan(theater: Theater, asOfYear: number = MAX_YEAR): Lifespan {
  if (theater.status === "open") {
    return { years: asOfYear - theater.openingYear, openEnded: true, unknownEnd: false };
  }
  if (theater.closingYear != null) {
    return { years: theater.closingYear - theater.openingYear, openEnded: false, unknownEnd: false };
  }
  return { years: null, openEnded: false, unknownEnd: true };
}

/** Theaters with a computable lifespan, longest first. Excludes unknown-end theaters (see {@link getLifespan}). */
export function longestRunning(theaters: Theater[], n: number, asOfYear: number = MAX_YEAR): Theater[] {
  return theaters
    .map((t) => ({ t, lifespan: getLifespan(t, asOfYear) }))
    .filter((x): x is { t: Theater; lifespan: Lifespan & { years: number } } => x.lifespan.years != null)
    .sort((a, b) => b.lifespan.years - a.lifespan.years)
    .slice(0, n)
    .map((x) => x.t);
}

/** Theaters with a fully known (not open-ended, not unknown-end) lifespan, shortest first. */
export function shortestLived(theaters: Theater[], n: number): Theater[] {
  return theaters
    .map((t) => ({ t, lifespan: getLifespan(t) }))
    .filter(
      (x): x is { t: Theater; lifespan: Lifespan & { years: number } } =>
        x.lifespan.years != null && !x.lifespan.openEnded
    )
    .sort((a, b) => a.lifespan.years - b.lifespan.years)
    .slice(0, n)
    .map((x) => x.t);
}

export function currentTheaters(theaters: Theater[]): Theater[] {
  return theaters.filter((t) => t.status === "open");
}

export function formerTheaters(theaters: Theater[]): Theater[] {
  return theaters.filter((t) => t.status === "closed");
}

export function boroughCounts(theaters: Theater[]): Record<Borough, number> {
  const out: Record<Borough, number> = {
    Manhattan: 0,
    Brooklyn: 0,
    Queens: 0,
    Bronx: 0,
    "Staten Island": 0,
  };
  for (const t of theaters) out[t.borough]++;
  return out;
}

/** The decade with the most openings (or closures, for a `closuresByDecade()` series). */
export function peakDecade(series: DecadeCount[]): DecadeCount | null {
  if (series.length === 0) return null;
  return series.reduce((max, d) => (d.count > max.count ? d : max), series[0]);
}
