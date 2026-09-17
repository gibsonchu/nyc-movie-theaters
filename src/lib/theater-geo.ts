import type { FeatureCollection, Point } from "geojson";
import type { Theater } from "@/types/theater";
import { MAX_YEAR, MIN_YEAR, OPEN_ENDED_SENTINEL } from "./timeline";

export interface TheaterPointProperties {
  id: string;
  name: string;
  borough: string;
  theaterType: string;
  openingYear: number;
  closingYear: number;
  featured: number;
}

export type TheaterFeatureCollection = FeatureCollection<Point, TheaterPointProperties>;

/**
 * Converts the editorial theater dataset into the GeoJSON MapLibre expects.
 * This is the one place that knows about presentation-layer translations the
 * timeline/map need but the data itself shouldn't carry:
 *  - `closingYear: null` -> a sentinel number MapLibre's expressions can compare,
 *    but ONLY for theaters actually still open (`status === "open"`). A theater
 *    confirmed closed with no recorded closing year (~300 of them — see
 *    theater-stats.ts) must never render as "still open" on the map just
 *    because it lacks a date. We don't invent the real closing year, but we do
 *    pick a map-only stand-in — its own opening year — so it reads as closed
 *    (fades to grey right after its opening fade-in) instead of as a
 *    currently-operating theater; this is a presentation compromise this file
 *    is documented to own, not a claim about when it actually closed.
 *  - opening/closing years outside [MIN_YEAR, MAX_YEAR] clamped to the
 *    timeline's range (a few dozen source records predate 1896, the year
 *    film exhibition began in NYC — almost certainly the building's
 *    construction date under an earlier use; the timeline itself, and any
 *    text derived from `Theater.openingYear` directly, stay accurate)
 * The rest of the visualization layer only ever sees TheaterPointProperties.
 */
export function theatersToFeatureCollection(theaters: Theater[]): TheaterFeatureCollection {
  return {
    type: "FeatureCollection",
    features: theaters.map((theater) => {
      const openingYear = clampToTimelineRange(theater.openingYear);
      const closingYear =
        theater.status === "open"
          ? OPEN_ENDED_SENTINEL
          : theater.closingYear != null
            ? clampToTimelineRange(theater.closingYear)
            : openingYear;
      return {
        type: "Feature" as const,
        id: theater.id,
        geometry: {
          type: "Point" as const,
          coordinates: [theater.longitude, theater.latitude],
        },
        properties: {
          id: theater.id,
          name: theater.name,
          borough: theater.borough,
          theaterType: theater.theaterType,
          openingYear,
          closingYear,
          featured: theater.featured ? 1 : 0,
        },
      };
    }),
  };
}

function clampToTimelineRange(year: number): number {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, year));
}
