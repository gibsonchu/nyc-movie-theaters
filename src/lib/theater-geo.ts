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
 *  - `closingYear: null` -> a sentinel number MapLibre's expressions can compare
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
    features: theaters.map((theater) => ({
      type: "Feature",
      id: theater.id,
      geometry: {
        type: "Point",
        coordinates: [theater.longitude, theater.latitude],
      },
      properties: {
        id: theater.id,
        name: theater.name,
        borough: theater.borough,
        theaterType: theater.theaterType,
        openingYear: clampToTimelineRange(theater.openingYear),
        closingYear:
          theater.closingYear != null ? clampToTimelineRange(theater.closingYear) : OPEN_ENDED_SENTINEL,
        featured: theater.featured ? 1 : 0,
      },
    })),
  };
}

function clampToTimelineRange(year: number): number {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, year));
}
